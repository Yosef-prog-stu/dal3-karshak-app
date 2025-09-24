import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, Clock, MapPin } from "lucide-react";
import heroImage from "@/assets/hero-restaurant.jpg";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center">
      {/* الخلفية */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* المحتوى */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-3xl mr-auto text-right">
          {/* العنوان الرئيسي */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              دلع
              <span className="gradient-golden bg-clip-text text-transparent mr-4">
                كرشك
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              اكتشف عالماً من النكهات الأصيلة والأطباق الشهية في مطعمنا المميز
            </p>
          </div>

          {/* المميزات */}
          <div className="flex flex-wrap gap-6 mb-10">
            <div className="flex items-center space-x-2 rtl:space-x-reverse bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="text-white font-medium">تقييم 4.9</span>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Clock className="w-5 h-5 text-green-400" />
              <span className="text-white font-medium">توصيل سريع</span>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <MapPin className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">خدمة محلية</span>
            </div>
          </div>

          {/* أزرار العمل */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <Button variant="hero" size="lg" className="text-lg px-8 py-3">
              اطلب الآن
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20">
              تصفح القائمة
            </Button>
          </div>
        </div>
      </div>

      {/* زخرفة سفلية */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;