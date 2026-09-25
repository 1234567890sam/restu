"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function seedSampleMenuForRestaurant(restaurantId: string): Promise<{
  success?: string;
  error?: string;
}> {
  if (!restaurantId) {
    return { error: "Restaurant ID is required." };
  }

  try {
    const admin = createAdminClient();

    // 1. Create Sample Categories
    const sampleCategories = [
      {
        restaurant_id: restaurantId,
        name: "Solapuri Specialties",
        slug: `solapuri-specialties-${restaurantId.substring(0, 5)}`,
        description: "Authentic local dishes made with famous groundnut chutney & spices",
        display_order: 0,
        is_visible: true,
      },
      {
        restaurant_id: restaurantId,
        name: "Tandoori & Starters",
        slug: `tandoori-starters-${restaurantId.substring(0, 5)}`,
        description: "Charcoal smoked kebabs, tikkas and hot appetizers",
        display_order: 1,
        is_visible: true,
      },
      {
        restaurant_id: restaurantId,
        name: "Main Course & Thalis",
        slug: `main-course-thalis-${restaurantId.substring(0, 5)}`,
        description: "Hearty gravies, authentic curries and special thalis",
        display_order: 2,
        is_visible: true,
      },
      {
        restaurant_id: restaurantId,
        name: "Breads, Biryani & Rice",
        slug: `breads-biryani-${restaurantId.substring(0, 5)}`,
        description: "Jawar Bhakri, butter naans, and aromatic dum biryanis",
        display_order: 3,
        is_visible: true,
      },
      {
        restaurant_id: restaurantId,
        name: "Beverages & Desserts",
        slug: `beverages-desserts-${restaurantId.substring(0, 5)}`,
        description: "Coolers, buttermilk, and traditional Indian sweets",
        display_order: 4,
        is_visible: true,
      },
    ];

    const { data: createdCats, error: catError } = await (admin as any)
      .from("categories")
      .insert(sampleCategories)
      .select();

    if (catError || !createdCats || createdCats.length === 0) {
      return { error: catError?.message || "Failed to create sample categories." };
    }

    const catMap = new Map<string, string>();
    createdCats.forEach((c: any) => {
      catMap.set(c.name, c.id);
    });

    const specialtiesId = catMap.get("Solapuri Specialties");
    const startersId = catMap.get("Tandoori & Starters");
    const mainsId = catMap.get("Main Course & Thalis");
    const breadsId = catMap.get("Breads, Biryani & Rice");
    const drinksId = catMap.get("Beverages & Desserts");

    // 2. Create Sample Dishes
    const sampleDishes: any[] = [];

    if (specialtiesId) {
      sampleDishes.push(
        {
          restaurant_id: restaurantId,
          category_id: specialtiesId,
          name: "Solapuri Shenga Chutney Thali",
          description: "Served with 2 Jawar Bhakris, traditional Pitla, spicy Shenga (groundnut) chutney, raw onion & thecha.",
          price: 180,
          offer_price: 200,
          food_type: "veg",
          is_veg: true,
          spice_level: "spicy",
          is_spicy: true,
          badge: "bestseller",
          is_bestseller: true,
          is_available: true,
          display_order: 0,
          image_url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80",
        },
        {
          restaurant_id: restaurantId,
          category_id: specialtiesId,
          name: "Solapuri Mutton Sukka",
          description: "Tender slow-cooked mutton in rich charred coconut & kala masala gravy with fresh coriander.",
          price: 340,
          food_type: "non-veg",
          is_veg: false,
          spice_level: "extra_spicy",
          is_spicy: true,
          badge: "chef_special",
          is_bestseller: true,
          is_available: true,
          display_order: 1,
          image_url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop&q=80",
        }
      );
    }

    if (startersId) {
      sampleDishes.push(
        {
          restaurant_id: restaurantId,
          category_id: startersId,
          name: "Paneer Tikka Angara",
          description: "Juicy malai paneer cubes marinated in yogurt, Kashmiri deghi mirch and mustard oil, grilled in tandoor.",
          price: 260,
          food_type: "veg",
          is_veg: true,
          spice_level: "medium",
          is_spicy: false,
          badge: "bestseller",
          is_bestseller: true,
          is_available: true,
          display_order: 0,
          image_url: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&auto=format&fit=crop&q=80",
        },
        {
          restaurant_id: restaurantId,
          category_id: startersId,
          name: "Murgh Malai Kebab",
          description: "Succulent chicken breast infused with cream cheese, cardamom and green chilies, finished with chaat masala.",
          price: 320,
          food_type: "non-veg",
          is_veg: false,
          spice_level: "mild",
          is_spicy: false,
          badge: "must_try",
          is_bestseller: false,
          is_available: true,
          display_order: 1,
          image_url: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80",
        }
      );
    }

    if (mainsId) {
      sampleDishes.push(
        {
          restaurant_id: restaurantId,
          category_id: mainsId,
          name: "Paneer Butter Masala",
          description: "Cottage cheese simmered in silky slow-simmered tomato butter gravy with aromatic dried fenugreek leaves.",
          price: 250,
          offer_price: 280,
          food_type: "veg",
          is_veg: true,
          spice_level: "mild",
          is_spicy: false,
          badge: "bestseller",
          is_bestseller: true,
          is_available: true,
          display_order: 0,
          image_url: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80",
        },
        {
          restaurant_id: restaurantId,
          category_id: mainsId,
          name: "Dal Makhani Desi Ghee",
          description: "Black lentils slow simmered overnight over coal embers, finished with farm butter and dairy cream.",
          price: 210,
          food_type: "veg",
          is_veg: true,
          spice_level: "mild",
          is_spicy: false,
          badge: null,
          is_bestseller: false,
          is_available: true,
          display_order: 1,
          image_url: "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=600&auto=format&fit=crop&q=80",
        }
      );
    }

    if (breadsId) {
      sampleDishes.push(
        {
          restaurant_id: restaurantId,
          category_id: breadsId,
          name: "Kadak Jawar Bhakri (2 Pcs)",
          description: "Traditional hand-patted sorghum flatbread roasted to perfection on earthen tawa.",
          price: 50,
          food_type: "veg",
          is_veg: true,
          spice_level: "mild",
          is_spicy: false,
          badge: null,
          is_bestseller: false,
          is_available: true,
          display_order: 0,
          image_url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80",
        },
        {
          restaurant_id: restaurantId,
          category_id: breadsId,
          name: "Dum Gosht Biryani",
          description: "Aged long-grain basmati rice layered with spiced marinated meat, saffron and sealed with dough.",
          price: 380,
          offer_price: 420,
          food_type: "non-veg",
          is_veg: false,
          spice_level: "spicy",
          is_spicy: true,
          badge: "bestseller",
          is_bestseller: true,
          is_available: true,
          display_order: 1,
          image_url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80",
        }
      );
    }

    if (drinksId) {
      sampleDishes.push(
        {
          restaurant_id: restaurantId,
          category_id: drinksId,
          name: "Solapuri Masala Taak",
          description: "Refreshing spiced churned buttermilk infused with roasted cumin, rock salt, ginger and fresh mint.",
          price: 50,
          food_type: "veg",
          is_veg: true,
          spice_level: "mild",
          is_spicy: false,
          badge: "bestseller",
          is_bestseller: true,
          is_available: true,
          display_order: 0,
          image_url: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=600&auto=format&fit=crop&q=80",
        },
        {
          restaurant_id: restaurantId,
          category_id: drinksId,
          name: "Gulab Jamun with Rabdi",
          description: "Warm soft khoya dumplings soaked in rose-cardamom syrup topped with thickened malai rabdi.",
          price: 130,
          food_type: "veg",
          is_veg: true,
          spice_level: "mild",
          is_spicy: false,
          badge: "chef_special",
          is_bestseller: false,
          is_available: true,
          display_order: 1,
          image_url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80",
        }
      );
    }

    if (sampleDishes.length > 0) {
      const { error: itemsError } = await (admin as any)
        .from("menu_items")
        .insert(sampleDishes);

      if (itemsError) {
        console.warn("Notice inserting sample dishes:", itemsError.message);
      }
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/items");
    revalidatePath("/dashboard/categories");

    return {
      success: `Sample menu populated successfully with ${sampleCategories.length} categories and ${sampleDishes.length} dishes!`,
    };
  } catch (err: any) {
    return { error: err.message || "Failed to populate sample menu" };
  }
}
