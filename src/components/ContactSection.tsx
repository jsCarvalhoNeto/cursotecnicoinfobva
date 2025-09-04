import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Send,
  MessageCircle,
  Users,
  Headphones
} from "lucide-react";

const ContactSection = () => {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Localização",
      details: ["Rua da Tecnologia, 123", "Centro - São Paulo/SP", "CEP: 01234-567"],
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: Phone,
      title: "Telefones",
      details: ["(11) 3456-7890", "(11) 9 8765-4321", "WhatsApp disponível"],
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Mail,
      title: "E-mails",
      details: ["contato@techportal.edu.br", "secretaria@techportal.edu.br", "suporte@techportal.edu.br"],
      color: "from-pink-500 to-red-600"
    },
    {
      icon: Clock,
      title: "Horário de Atendimento",
      details: ["Segunda a Sexta: 8h às 22h", "Sábado: 8h às 12h", "Suporte online 24/7"],
      color: "from-red-500 to-orange-600"
    }
  ];

  const supportChannels = [
    {
      icon: MessageCircle,
      name: "Chat Online",
      description: "Tire suas dúvidas em tempo real",
      action: "Iniciar Chat"
    },
    {
      icon: Users,
      name: "Fórum da Comunidade", 
      description: "Conecte-se com outros alunos",
      action: "Acessar Fórum"
    },
    {
      icon: Headphones,
      name: "Suporte Técnico",
      description: "Ajuda especializada 24/7",
      action: "Contatar Suporte"
    }
  ];

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Entre em Contato
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Estamos aqui para ajudar você em sua jornada educacional. 
            Entre em contato conosco através dos canais disponíveis.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
          {/* Contact Form */}
          <div className="animate-fade-in">
            <Card className="bg-gradient-card border-none shadow-medium">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-6">
                  Envie sua Mensagem
                </h3>
                
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Nome Completo
                      </label>
                      <Input 
                        placeholder="Digite seu nome completo"
                        className="bg-background/50 border-border focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        E-mail
                      </label>
                      <Input 
                        type="email"
                        placeholder="seu@email.com"
                        className="bg-background/50 border-border focus:border-primary"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Telefone
                    </label>
                    <Input 
                      placeholder="(11) 9 9999-9999"
                      className="bg-background/50 border-border focus:border-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Assunto
                    </label>
                    <Input 
                      placeholder="Qual o motivo do seu contato?"
                      className="bg-background/50 border-border focus:border-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Mensagem
                    </label>
                    <Textarea 
                      placeholder="Descreva sua dúvida ou solicitação..."
                      rows={5}
                      className="bg-background/50 border-border focus:border-primary resize-none"
                    />
                  </div>
                  
                  <Button 
                    variant="gradient" 
                    size="lg" 
                    className="w-full"
                    type="submit"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Enviar Mensagem
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="grid grid-cols-1 gap-6 mb-8">
              {contactInfo.map((info, index) => (
                <Card 
                  key={info.title}
                  className="group hover:shadow-medium transition-all duration-300 bg-card border-none"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${info.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                        <info.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-foreground mb-2">
                          {info.title}
                        </h4>
                        <div className="space-y-1">
                          {info.details.map((detail, idx) => (
                            <p key={idx} className="text-muted-foreground">
                              {detail}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Support Channels */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-8">
            Outros Canais de Suporte
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {supportChannels.map((channel, index) => (
              <Card 
                key={channel.name}
                className="group hover:shadow-strong transition-all duration-300 hover:-translate-y-2 bg-gradient-card border-none animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <channel.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h4 className="text-xl font-semibold text-foreground mb-3">
                    {channel.name}
                  </h4>
                  
                  <p className="text-muted-foreground mb-6">
                    {channel.description}
                  </p>
                  
                  <Button variant="hero" size="sm" className="w-full">
                    {channel.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="bg-muted rounded-2xl h-64 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Mapa interativo da localização será carregado aqui
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;