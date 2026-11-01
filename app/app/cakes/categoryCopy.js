// Reviewed commercial-intent copy; catalog remains the source for weights and prices.
export const CATEGORY_COPY = {
  "flavoured-cakes": {
    "heading": "Birthday cake flavours from Ilanji, Tenkasi",
    "paragraphs": [
      "Compare the current butterscotch, blackcurrant, chocolate and choco truffle options in this collection. Each product page shows its own available weights and prices; a design or price from another cake does not automatically apply to the one you choose.",
      "For a birthday, tell us your preferred flavour, guest count, cake message and cake-cutting time. If you need an ingredient change or an eggless option, ask us to check the specific cake before ordering. An eggless request does not establish that a cake is safe for an allergy.",
      "Send your address or map pin so we can check delivery within 20 km by road from Ilanji. We confirm availability, final price and payment instructions on WhatsApp. Same-day requests are subject to confirmation, rather than guaranteed by choosing a standard flavour."
    ]
  },
  "brownie": {
    "heading": "Brownies for birthdays, sharing and gifts",
    "paragraphs": [
      "This collection includes the current Birthday Brownie and Classic Fudgy Brownie listings. Compare their individual weights, prices and photos before choosing the one that suits your celebration.",
      "Tell us whether you are planning a birthday presentation, a gift or portions for a group. Ask about portioning and any message or presentation change you need; the listing price does not confirm every possible customization.",
      "For an office, hall or another venue, agree who will receive the order and when it will be served. Ask us for the handling and storage advice appropriate to your order. Delivery is checked against the actual address within 20 km by road from our Ilanji bakery."
    ]
  },
  "custom-cake": {
    "heading": "Custom and photo cakes: prepare your design brief",
    "paragraphs": [
      "Start with the current photo or cartoon-theme listings, then send the date, preferred size, cake message and a design reference. Identify the colours or details that matter most so we can check what is feasible for the chosen cake.",
      "For a photo cake, have a clear original image ready to attach in WhatsApp after the design check. Cropped screenshots and small compressed images can lose detail; discuss the image and print layout with us before confirming.",
      "We confirm design feasibility, preparation, available arrangements and any additional charge in the order conversation. Check the final cake details and payment instructions there. Delivery destinations are checked individually within the 20 km road limit from Ilanji."
    ]
  },
  "tier-cake": {
    "heading": "Tiered cakes for weddings, engagements and anniversaries",
    "paragraphs": [
      "Compare the current two-tier and three-tier cakes, then discuss your guest count and design reference with us. A tier count alone does not establish how many servings your chosen cake will provide.",
      "Send the venue, cake-cutting time and preferred presentation alongside your requested size. Ask us to check the structure, design and handover arrangements together, especially if the cake must wait before serving or needs setup at the venue.",
      "Tiered and detailed designs require an individual availability and preparation check. Do not assume a fixed lead time or automatic same-day slot. We confirm the design, total, payment instructions and address-level delivery arrangements before the order is accepted."
    ]
  },
  "premium-cake": {
    "heading": "Black Forest, White Forest and Red Velvet cakes",
    "paragraphs": [
      "Browse the current premium collection and compare the actual cake photos, available weights and prices. Choose the flavour you prefer, then discuss your event date, cake message and any design change with us.",
      "For cream cakes, plan where the cake will be kept before serving. Tell us the cake-cutting time and ask for handling advice for the cake you choose. Confirm any ingredient or dietary request before ordering.",
      "The bakery is in Ilanji, Tenkasi. Share your destination so we can check the road route, the 20 km coverage limit and availability. The order conversation confirms the final amount and arrangements."
    ]
  },
  "themed-cake": {
    "heading": "Themed cake designs: check your occasion and date",
    "paragraphs": [
      "Use the current catalog photos as starting points for a design conversation. A seasonal or event-themed listing does not establish availability for every date; ask us to check the cake and decoration you want.",
      "Send a reference, preferred colours, message, guest count and event time. We will confirm feasible changes and the final amount. For a detailed design, allow time for that discussion before settling your event arrangements.",
      "Check your delivery address within 20 km by road from our Ilanji bakery. A website enquiry begins the conversation; review the cake details, payment instructions and order confirmation in WhatsApp."
    ]
  }
};

export function genericCopy(name) {
  return { heading: `${name} from Serle's Bake`, paragraphs: [
    'Browse the current cake listings and ask us to check the size, design and date you need. Prices and weights are shown on the relevant product page.',
    'Delivery is checked for your address within 20 km by road from Ilanji. Confirm availability, the final amount and your order details on WhatsApp.'
  ] };
}
export function copyForCategory(slug, name) { return CATEGORY_COPY[slug] || genericCopy(name || slug); }
