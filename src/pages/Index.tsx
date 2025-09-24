import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import MenuSection from "@/components/MenuSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, MapPin, Clock, Facebook, Instagram, Twitter } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <MenuSection />
      
      {/* قسم عن المطعم */}
      <section id="about" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-right">
              <h2 className="text-4xl font-bold text-foreground mb-6">
                عن مطعم
                <span className="gradient-golden bg-clip-text text-transparent mr-3">دلع كرشك</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                منذ تأسيسنا عام 2015، ونحن نقدم أفضل الأطباق العربية والعالمية بنكهات أصيلة ومذاق لا يُنسى. 
                نستخدم أجود المكونات الطازجة ونحضر كل طبق بحب وعناية فائقة.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                فريقنا من الطهاة المحترفين يجمع بين الخبرة التقليدية والإبداع الحديث لنقدم لك تجربة طعام استثنائية 
                في أجواء مريحة وخدمة متميزة.
              </p>
              <Button variant="hero" size="lg">
                احجز طاولتك الآن
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <Card className="shadow-soft">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-4">👨‍🍳</div>
                  <h3 className="text-xl font-bold text-foreground mb-2">طهاة محترفون</h3>
                  <p className="text-muted-foreground">خبرة تزيد عن 20 عاماً</p>
                </CardContent>
              </Card>
              <Card className="shadow-soft">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-4">🥘</div>
                  <h3 className="text-xl font-bold text-foreground mb-2">أطباق متنوعة</h3>
                  <p className="text-muted-foreground">أكثر من 150 طبق مميز</p>
                </CardContent>
              </Card>
              <Card className="shadow-soft">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-4">⭐</div>
                  <h3 className="text-xl font-bold text-foreground mb-2">تقييم عالي</h3>
                  <p className="text-muted-foreground">4.9 من 5 نجوم</p>
                </CardContent>
              </Card>
              <Card className="shadow-soft">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-4">🚚</div>
                  <h3 className="text-xl font-bold text-foreground mb-2">توصيل سريع</h3>
                  <p className="text-muted-foreground">خلال 30 دقيقة</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* قسم التواصل */}
      <section id="contact" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              تواصل
              <span className="gradient-golden bg-clip-text text-transparent mr-3">معنا</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              نحن هنا لخدمتك في أي وقت
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center shadow-soft hover:shadow-warm transition-smooth">
              <CardContent className="p-8">
                <div className="w-16 h-16 gradient-warm rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">اتصل بنا</h3>
                <p className="text-muted-foreground mb-2">+966 12 345 6789</p>
                <p className="text-muted-foreground">+966 50 123 4567</p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-soft hover:shadow-warm transition-smooth">
              <CardContent className="p-8">
                <div className="w-16 h-16 gradient-golden rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">موقعنا</h3>
                <p className="text-muted-foreground mb-2">شارع الأمير محمد بن عبدالعزيز</p>
                <p className="text-muted-foreground">الرياض، المملكة العربية السعودية</p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-soft hover:shadow-warm transition-smooth">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-accent-warm rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">أوقات العمل</h3>
                <p className="text-muted-foreground mb-2">يومياً: 11:00 ص - 12:00 م</p>
                <p className="text-muted-foreground">الجمعة: 2:00 م - 12:00 م</p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button variant="hero" size="lg" className="mb-8">
              احجز طاولتك الآن
            </Button>
            <div className="flex justify-center space-x-6 rtl:space-x-reverse">
              <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* الفوتر */}
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse mb-6">
              <div className="w-12 h-12 gradient-warm rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-primary-foreground">د</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold">دلع كرشك</h3>
                <p className="text-sm opacity-80">مطعم الأطباق الشهية</p>
              </div>
            </div>
            <p className="text-background/80 mb-4">
              جميع الحقوق محفوظة © 2024 مطعم دلع كرشك
            </p>
            <p className="text-background/60 text-sm">
              صُمم بحب لتقديم أفضل تجربة طعام
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;