import { Button } from "@/components/ui/button";
import { Menu, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { CartSheet, CartSummary } from "@/components/CartSheet";

const Header = () => {
  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* الشعار */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="w-12 h-12 gradient-warm rounded-full flex items-center justify-center shadow-warm">
              <span className="text-2xl font-bold text-primary-foreground">د</span>
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-bold text-foreground">دلع كرشك</h1>
              <p className="text-sm text-muted-foreground">مطعم الأطباق الشهية</p>
            </div>
          </div>

          {/* قائمة التنقل */}
          <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            <a href="#home" className="text-foreground hover:text-primary transition-smooth font-medium">
              الرئيسية
            </a>
            <a href="#menu" className="text-foreground hover:text-primary transition-smooth font-medium">
              القائمة
            </a>
            <a href="#about" className="text-foreground hover:text-primary transition-smooth font-medium">
              عن المطعم
            </a>
            <a href="#contact" className="text-foreground hover:text-primary transition-smooth font-medium">
              تواصل معنا
            </a>
          </nav>

          {/* معلومات الاتصال والطلب */}
          <div className="hidden lg:flex items-center space-x-4 rtl:space-x-reverse">
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm">
              <Phone className="w-4 h-4 text-primary" />
              <span className="text-foreground">123-456-7890</span>
            </div>
            <Button variant="hero" size="sm">
              اطلب الآن
            </Button>
            <Link to="/admin">
              <Button variant="outline" size="sm">
                الادارة
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <CartSummary />
              <CartSheet />
            </div>
          </div>

          {/* زر القائمة للجوال */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;