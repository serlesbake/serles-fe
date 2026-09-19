/**
 * Server-rendered copy for each category page.
 *
 * Category pages were ~200 words, against ~1,200 for a blog post — thin for URLs
 * that have to rank for commercial keywords. This is written per category rather
 * than generated from a template on purpose: the same paragraphs with the name
 * swapped in would be duplicate content across six URLs, which is worse than
 * having none.
 *
 * Keyed by the category slug the API returns. Anything not listed falls back to
 * `genericCopy()`, which is deliberately short — a new category is better served
 * by real copy added here than by filler.
 */

export const CATEGORY_COPY = {
  brownie: {
    heading: 'Fudgy Brownies, Baked Fresh in Tenkasi',
    paragraphs: [
      "Our brownies are baked dense and fudgy rather than cakey — a proper chew in the middle, a thin crackled top, and enough dark chocolate that they do not need frosting to carry them. They are cut to order from a fresh tray, so what reaches you has not been sitting in a display case.",
      "Brownies travel better than cream cakes, which makes them the practical choice when a cake is not. They hold up in Tenkasi's heat, survive a scooter ride without losing their shape, and portion neatly — which is why they are what most people order for office celebrations, classroom treats, and anything that has to be handed round a room.",
      "A brownie tray also works as a gift when you do not know the person's flavour preference, and as a dessert when a whole cake is too much. If you want them warm, tell us your delivery window and we will time the bake.",
    ],
  },

  'tier-cake': {
    heading: 'Tiered Cakes for Weddings and Big Occasions',
    paragraphs: [
      "A tiered cake is structural work as much as baking. Each tier is baked separately, levelled, filled and chilled, then stacked on internal supports so the weight of the upper tiers does not compress the lower ones. That is what keeps a cake standing through a long reception rather than slumping an hour in.",
      "Tell us the guest count and we will tell you the tier count honestly — a cake that looks impressive but does not feed the room is a bad trade, and so is one you pay for and cannot finish. Two tiers suit most engagements and anniversaries; three or more make sense for a wedding reception.",
      "These need the most notice of anything we bake: at least a day for two tiers, and more for anything sculpted or with sugar flowers. Send us a reference picture along with your date and venue, and we will tell you what is achievable at what weight before you commit.",
    ],
  },

  'flavoured-cakes': {
    heading: 'Flavoured Cakes — Pick What You Actually Like',
    paragraphs: [
      "This is the everyday range: butterscotch, blackcurrant, chocolate, choco truffle and the rest, baked to order rather than pulled from a fridge. Each one is a full sponge layered with its own filling, not a plain base with flavouring brushed over the top.",
      "Flavour choice matters more than it looks. Fruit and blackcurrant cakes cut cleanly and feel lighter after a heavy meal. Chocolate and truffle are richer and read as more of an occasion, but a room that has just eaten will leave them unfinished. Butterscotch sits between the two and is the safest choice when you are feeding a mixed group.",
      "If you are ordering for a crowd and cannot canvass everyone, ask us — we would rather recommend the cake that suits your gathering than sell you the most expensive one on the list.",
    ],
  },

  'premium-cake': {
    heading: 'Premium Cakes: Black Forest, Red Velvet and More',
    paragraphs: [
      "The premium range is where the ingredients and the labour both step up. Black Forest is built the way it should be — cherries and real dark chocolate shavings, not cocoa dust. Red Velvet gets a proper cream cheese frosting rather than sweetened whipped cream, which is the difference between a cake that tastes like something and one that just tastes sweet.",
      "These take longer to make and use costlier ingredients, so they cost more than the everyday flavours. What you are paying for is mostly in the filling and the finish: more layers, better chocolate, and frosting that holds its edge instead of sliding.",
      "They are the usual choice for milestone birthdays, anniversaries and anything where the cake is the centre of the table rather than an afterthought. Cream-heavy cakes are the least heat-tolerant thing we bake, so for an outdoor event in summer, tell us and we will advise on timing.",
    ],
  },

  'custom-cake': {
    heading: 'Custom and Photo Cakes, Made to Your Brief',
    paragraphs: [
      "Custom cakes are built to a brief rather than picked from a list. Send a reference picture — a screenshot, a photo of a cake you liked, even a rough sketch — and we will tell you plainly what is achievable at what weight and price before you commit to anything.",
      "Photo cakes carry an edible print of your own image on the surface. They are the most popular thing we make for first birthdays, retirements and farewells, where the picture is the point. Send the highest-resolution image you have: a sharp, well-lit photo prints cleanly, and a small blurry one will look worse on a cake than it does on a phone.",
      "Sculpted and theme cakes take the most hands-on work, so they need the most notice. Some designs are genuinely harder than they look, and a few do not survive the trip in Tenkasi's heat. We will tell you when that is the case rather than take the order and disappoint you.",
    ],
  },

  'themed-cake': {
    heading: 'Theme Cakes for Parties and Celebrations',
    paragraphs: [
      "Theme cakes are decorated around an idea — a cartoon character, a hobby, a colour scheme, a festival — rather than a flavour. The sponge underneath is still your choice, so you are not stuck with a cake that looks right and tastes like an afterthought.",
      "Children's parties are the most common reason people order these, and the usual mistake is choosing a design that photographs well but does not slice sensibly for twenty children. We will suggest the shape and weight that serves your guest count while keeping the design you want.",
      "Festival and seasonal cakes book out quickly around the dates they are made for, so order early for those. For everything else, a day's notice is usually enough — send your theme, your date and a rough guest count and we will confirm what we can do.",
    ],
  },
};

/** Fallback for a category with no bespoke copy yet. */
export function genericCopy(name) {
  return {
    heading: `${name} from Serle's Bake`,
    paragraphs: [
      `Our ${name.toLowerCase()} are baked to order in our own kitchen in Tenkasi — never pulled from a display fridge. Choose a weight, tell us the occasion and your date, and we bake it fresh for you.`,
      "We deliver across Tenkasi and the surrounding area, with same-day delivery usually possible on standard cakes ordered in the morning. Custom designs need at least a day's notice so the bake and the decoration are not rushed.",
    ],
  };
}

export function copyForCategory(slug, name) {
  return CATEGORY_COPY[slug] || genericCopy(name || slug);
}
