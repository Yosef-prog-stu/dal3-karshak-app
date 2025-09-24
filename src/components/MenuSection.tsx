import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Plus } from "lucide-react";

const MenuSection = () => {
  const menuItems = [
    {
      id: 1,
      name: "كبسة اللحم الفاخرة",
      description: "أرز بسمتي فاخر مع لحم الخروف الطري والتوابل العربية الأصيلة",
      price: "85 ريال",
      rating: 4.9,
      image: "🍛",
      category: "أطباق رئيسية",
      isPopular: true
    },
    {
      id: 2,
      name: "مشاوي مشكلة",
      description: "تشكيلة من أفضل المشاوي: كباب، شيش طاووق، وكفتة مشوية",
      price: "95 ريال",
      rating: 4.8,
      image: "🍖",
      category: "مشاوي",
      isPopular: true
    },
    {
      id: 3,
      name: "حمص بالطحينة الخاص",
      description: "حمص كريمي مع الطحينة والزيت البكر وحبات الصنوبر",
      price: "25 ريال",
      rating: 4.7,
      image: "🥙",
      category: "مقبلات"
    },
    {
      id: 4,
      name: "فراخ مشوية بالأعشاب",
      description: "فراخ طرية محشوة بالأرز والمكسرات مع صلصة الأعشاب",
      price: "65 ريال",
      rating: 4.6,
      image: "🍗",
      category: "أطباق رئيسية"
    },
    {
      id: 5,
      name: "فتوش لبناني أصيل",
      description: "سلطة الفتوش الطازجة مع الخضار الموسمية ودبس الرمان",
      price: "30 ريال",
      rating: 4.5,
      image: "🥗",
      category: "سلطات"
    },
    {
      id: 6,
      name: "كنافة نابلسية فاخرة",
      description: "كنافة طازجة بالجبن الحلو مع القطر والفستق الحلبي",
      price: "40 ريال",
      rating: 4.9,
      image: "🍰",
      category: "حلويات"
    }
  ];

  const categories = ["جميع الأطباق", "أطباق رئيسية", "مشاوي", "مقبلات", "سلطات", "حلويات"];

  return (
    <section id="menu" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* العنوان */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            قائمة
            <span className="gradient-golden bg-clip-text text-transparent mr-3">الطعام</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            اكتشف تشكيلة واسعة من الأطباق اللذيذة المحضرة بأجود المكونات
          </p>
        </div>

        {/* فلتر الفئات */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={category === "جميع الأطباق" ? "golden" : "outline"}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* الأطباق */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems.map((item) => (
            <Card key={item.id} className="overflow-hidden shadow-soft hover:shadow-warm transition-smooth group">
              <CardContent className="p-0">
                {/* صورة الطبق */}
                <div className="relative">
                  <div className="h-48 bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-6xl">
                    {item.image}
                  </div>
                  {item.isPopular && (
                    <Badge className="absolute top-4 right-4 gradient-hero text-primary-foreground">
                      الأكثر طلباً
                    </Badge>
                  )}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1 rtl:space-x-reverse">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{item.rating}</span>
                  </div>
                </div>

                {/* معلومات الطبق */}
                <div className="p-6">
                  <div className="mb-3">
                    <Badge variant="outline" className="text-xs mb-2">
                      {item.category}
                    </Badge>
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-smooth">
                      {item.name}
                    </h3>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-primary">
                      {item.price}
                    </div>
                    <Button variant="warm" size="sm" className="rounded-full">
                      <Plus className="w-4 h-4 ml-1" />
                      إضافة
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* زر عرض المزيد */}
        <div className="text-center mt-12">
          <Button variant="golden" size="lg" className="px-8">
            عرض القائمة الكاملة
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;