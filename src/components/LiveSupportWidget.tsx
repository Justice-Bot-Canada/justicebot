import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
// ❌ REMOVED - Sonner causing runtime errors
// import { toast } from "sonner";
import { toast } from "@/lib/toast-stub";

interface Message {
  id: string;
  sender_type: 'user' | 'agent' | 'bot';
  sender_name: string;
  message: string;
  created_at: string;
}

export default function LiveSupportWidget() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [currentTicket, setCurrentTicket] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [agentOnline, setAgentOnline] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Check if support hours (9am-5pm EST Mon-Fri)
  useEffect(() => {
    checkSupportHours();
    const interval = setInterval(checkSupportHours, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentTicket) {
      loadMessages();
      subscribeToMessages();
    }
  }, [currentTicket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const checkSupportHours = () => {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    
    // Monday-Friday, 9am-5pm
    const isBusinessDay = day >= 1 && day <= 5;
    const isBusinessHours = hour >= 9 && hour < 17;
    
    setAgentOnline(isBusinessDay && isBusinessHours);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const createTicket = async () => {
    if (!user) {
      toast.error('Please sign in to use support');
      return null;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name, first_name')
      .eq('user_id', user.id)
      .single();

    const name = profile?.display_name || profile?.first_name || 'User';

    const { data, error } = await supabase
      .from('support_tickets')
      .insert({
        user_id: user.id,
        email: user.email!,
        name,
        subject: 'Live Chat Support',
        status: 'open',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating ticket:', error);
      toast.error('Failed to start chat');
      return null;
    }

    return data.id;
  };

  const loadMessages = async () => {
    if (!currentTicket) return;

    const { data, error } = await supabase
      .from('support_messages')
      .select('*')
      .eq('ticket_id', currentTicket)
      .order('created_at');

    if (error) {
      console.error('Error loading messages:', error);
    } else {
      setMessages((data as Message[]) || []);
    }
  };

  const subscribeToMessages = () => {
    if (!currentTicket) return;

    const channel = supabase
      .channel(`support-${currentTicket}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'support_messages',
          filter: `ticket_id=eq.${currentTicket}`
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => [...prev, newMessage]);
          setIsTyping(false);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    if (!currentTicket) {
      const ticketId = await createTicket();
      if (!ticketId) return;
      setCurrentTicket(ticketId);
    }

    const message = inputMessage.trim();
    setInputMessage("");

    // Add user message
    const { error } = await supabase
      .from('support_messages')
      .insert({
        ticket_id: currentTicket,
        sender_type: 'user',
        sender_name: user?.email || 'You',
        message,
      });

    if (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      return;
    }

    // If no agent online, trigger AI response
    if (!agentOnline) {
      setIsTyping(true);
      setTimeout(() => {
        sendAIResponse(message);
      }, 1500);
    }
  };

  const sendAIResponse = async (userMessage: string) => {
    // Simple AI responses based on keywords
    let response = "Thanks for reaching out! A support agent will respond during business hours (Mon-Fri, 9am-5pm EST). In the meantime, have you tried our AI Legal Assistant or searched our FAQ?";

    if (userMessage.toLowerCase().includes('form')) {
      response = "For help with forms, visit our Document Templates page or use the AI Legal Assistant for step-by-step guidance.";
    } else if (userMessage.toLowerCase().includes('payment')) {
      response = "For payment inquiries, please visit your Profile page to view transaction history. An agent will review your case during business hours.";
    } else if (userMessage.toLowerCase().includes('urgent')) {
      response = "If you have an urgent legal matter, please contact a licensed lawyer directly. Justice-Bot provides guidance but is not a replacement for legal counsel.";
    }

    await supabase
      .from('support_messages')
      .insert({
        ticket_id: currentTicket,
        sender_type: 'bot',
        sender_name: 'Justice-Bot Assistant',
        message: response,
      });
  };

  const handleOpen = async () => {
    setIsOpen(true);
    if (!currentTicket && user) {
      const ticketId = await createTicket();
      if (ticketId) {
        setCurrentTicket(ticketId);
      }
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all z-50"
          size="icon"
        >
          <MessageCircle className="w-6 h-6" />
          {!agentOnline && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
          )}
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-[380px] h-[600px] shadow-2xl flex flex-col z-50">
          {/* Header */}
          <div className="p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                <div>
                  <h3 className="font-semibold">Live Support</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant={agentOnline ? "default" : "secondary"} className="text-xs">
                      {agentOnline ? "Agent Available" : "AI Assistant"}
                    </Badge>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-primary-foreground hover:bg-primary-foreground/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">
                    {agentOnline 
                      ? "Hi! How can we help you today?" 
                      : "Our AI assistant is here to help. An agent will be available during business hours."}
                  </p>
                </div>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${msg.sender_type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    msg.sender_type === 'user' ? 'bg-primary' : 'bg-muted'
                  }`}>
                    {msg.sender_type === 'user' ? (
                      <User className="w-4 h-4 text-primary-foreground" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div className={`flex-1 ${msg.sender_type === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block max-w-[80%] rounded-lg p-3 ${
                      msg.sender_type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}>
                      <p className="text-sm">{msg.message}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(msg.created_at).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-75" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-150" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex gap-2"
            >
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </Card>
      )}
    </>
  );
}
