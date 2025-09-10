import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, BookOpen, User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, userRole, signOut, isAdmin, isStudent } = useAuth();

  const navigationItems = [
    { name: "Início", href: "/" },
    { name: "Disciplinas", href: "/disciplinas" },
    { name: "Projetos", href: "#projects" },
    { name: "Notícias", href: "#news" },
    { name: "Eventos", href: "#events" },
    { name: "Contato", href: "#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-hero/95 backdrop-blur-md border-b border-white/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Portal Informática</h1>
              <p className="text-xs text-white/80">Curso Técnico</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              item.href.startsWith('/') ? (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-white/90 hover:text-white transition-colors duration-200 font-medium text-sm"
                >
                  {item.name}
                </Link>
              ) : (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-white/90 hover:text-white transition-colors duration-200 font-medium text-sm"
                >
                  {item.name}
                </a>
              )
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center gap-3">
                {isStudent && (
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" asChild>
                    <Link to="/student">
                      <User className="w-4 h-4 mr-2" />
                      Área do Aluno
                    </Link>
                  </Button>
                )}
                {isAdmin && (
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" asChild>
                    <Link to="/admin">
                      <User className="w-4 h-4 mr-2" />
                      Painel Admin
                    </Link>
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  className="border-white/20 text-white hover:bg-white/10"
                  onClick={signOut}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </div>
            ) : (
              <Button className="bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 hover:border-white/50 shadow-glow" asChild>
                <Link to="/auth">Fazer Login</Link>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:bg-white/10"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20 animate-fade-in">
            <nav className="flex flex-col space-y-4">
              {navigationItems.map((item) => (
                item.href.startsWith('/') ? (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-white/90 hover:text-white transition-colors duration-200 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-white/90 hover:text-white transition-colors duration-200 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                )
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-white/20">
                {user ? (
                  <>
                    {isStudent && (
                      <Button 
                        variant="outline" 
                        className="w-full justify-start border-white/20 text-white hover:bg-white/10"
                        asChild
                      >
                        <Link to="/student">
                          <User className="w-4 h-4 mr-2" />
                          Área do Aluno
                        </Link>
                      </Button>
                    )}
                    {isAdmin && (
                      <Button 
                        variant="outline" 
                        className="w-full justify-start border-white/20 text-white hover:bg-white/10"
                        asChild
                      >
                        <Link to="/admin">
                          <User className="w-4 h-4 mr-2" />
                          Painel Admin
                        </Link>
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      className="w-full justify-start border-white/20 text-white hover:bg-white/10"
                      onClick={signOut}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sair
                    </Button>
                  </>
                ) : (
                  <Button className="w-full justify-start bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30" asChild>
                    <Link to="/auth">Fazer Login</Link>
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;