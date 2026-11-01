// One-time route research, 2 Nov 2026. OSM village points, not blanket address coverage.
// Origin is the centre of the bakery's known plus code 6JWVX77J+CH.
export const DELIVERY_AREA_PAGES = [
  {
    slug: 'panpoli', name: 'Panpoli', aliases: 'Panpozhi', km: 9.6,
    latitude: 9.0201842, longitude: 77.2529538,
    intro: 'Planning a cake for Panpoli, also called Panpozhi? Send your village address or venue pin to our bakery in Ilanji. The driving-route estimate to the mapped Panpoli village point is about 9.6 km; the route to your door is checked separately.',
    heading: 'Panpoli and the destination beyond the town name',
    paragraphs: [
      'If Panpoli is the landmark you use for a smaller settlement, include that settlement and its map pin as well. A route to Panpoli does not establish the distance to a house further along the road. Tell us the destination before choosing the delivery arrangements.',
      'For an event at a hall, send the hall name, its entrance and the cake-cutting time. If you are ordering a custom design, attach a reference and say which parts matter most. We will check the design, date and address together before confirming availability.',
    ],
    question: 'Does the Panpoli route cover Mekkarai too?',
    answer: 'No. They are separate destinations. Our Mekkarai guide uses a separate village-point route. Send the actual delivery pin so we can check it against the 20 km road limit.',
    related: ['mekkarai', 'pudur-sengottai'],
  },
  {
    slug: 'pudur-sengottai', name: 'Pudur near Sengottai', aliases: 'Pudur (S), Shencottai area', km: 8.6,
    latitude: 8.9960723, longitude: 77.2153924,
    intro: 'This guide is for the mapped Pudur village in the Shenkottai area of Tenkasi district. The driving-route estimate from our Ilanji bakery to that village point is about 8.6 km. Share your exact address so we can confirm that it is the same Pudur and check the final route.',
    heading: 'Make sure we are discussing the right Pudur',
    paragraphs: [
      'Pudur is a name used by more than one settlement. Please include Sengottai or Shencottai, your postcode where known, and a map pin in the order conversation. This page does not refer to Puttur in Karnataka or confirm that every similarly written village is the same destination.',
      'Kattalai Kudiyiruppu is another local destination to identify separately. A public location listed in a Tamil Nadu health-department document gives a driving-route estimate of about 7.2 km from the bakery coordinates (checked 2 November 2026). That is a route to the public point, not every home in the settlement. Send your own address rather than using the Pudur village estimate for it.',
      'If a relative is placing the order from another city, agree the delivery pin with the person receiving the cake before sending it to us. A local contact can explain the entrance or nearby landmark. Share their contact privately in the WhatsApp order conversation.',
    ],
    question: 'Is this the same place as every Puttur search result?',
    answer: 'No. This page refers only to the mapped Pudur near Sengottai in Tenkasi district. For another spelling or settlement, send the pin and ask us to check it.',
    related: ['puliyarai', 'panpoli'],
  },
  {
    slug: 'puliyarai', name: 'Puliyarai', aliases: 'Shenkottai area, Tenkasi district', km: 12.0,
    latitude: 9.0043321, longitude: 77.1884827,
    intro: 'For a celebration in Puliyarai, check the destination with Serle’s Bake in Ilanji before arranging your cake. A driving route to the mapped Puliyarai village point is about 12.0 km. This is a village-point estimate, not a promise for every address beyond it.',
    heading: 'Use your destination, rather than a road or forest-area label',
    paragraphs: [
      'Some map and travel results use a Puliyarai forest-area or road endpoint rather than the village. The estimate on this page uses the mapped village point. Send the home or venue pin for your order, especially if Puliyarai is only a landmark on the way.',
      'For a fragile or tiered design, discuss the final handover and storage before confirming. Tell us the cake-cutting time and whether someone will be ready to receive the cake. If any access arrangement or restriction applies to your destination, explain it when you enquire so that we can check feasibility.',
    ],
    question: 'Can a cake be delivered further along my journey?',
    answer: 'We check the actual destination against the 20 km road limit from Ilanji. A route passing through Puliyarai does not confirm delivery to a further stop. Ask before making plans or payment.',
    related: ['pudur-sengottai', 'panpoli'],
  },
  {
    slug: 'melagaram', name: 'Melagaram', aliases: 'Tenkasi–Courtallam area', km: 5.0,
    latitude: 8.9507, longitude: 77.2960936,
    intro: 'Ordering a cake for Melagaram? Our bakery is in Ilanji, and the driving-route estimate to the mapped Melagaram village point is about 5.0 km. Send your home, hall or other venue pin so we can check the actual distance, availability and charge.',
    heading: 'Check the entrance and handover for your Melagaram address',
    paragraphs: [
      'A broader Tenkasi or Courtallam address may not identify the precise entrance in Melagaram. Give us the street or venue name alongside the pin. The published first-5-km delivery rate is applied to the checked route, not automatically to every order using the Melagaram name.',
      'If your gathering starts before the cake-cutting, tell us both times so we can discuss the handover. Ask the recipient or venue where the cake can be kept until serving. Agree the cake message, preferred weight and design before you confirm the order.',
    ],
    question: 'Does a 5 km village estimate guarantee the first-zone delivery charge?',
    answer: 'No. Your final address can be closer or further away than the mapped point. We check the road distance and quote the delivery charge for that address before confirming.',
    related: ['panpoli', 'pudur-sengottai'],
  },
  {
    slug: 'mekkarai', name: 'Mekkarai', aliases: 'Mekarai, Mekkara', km: 16.1,
    latitude: 9.060605, longitude: 77.21893,
    intro: 'For Mekkarai cake enquiries, send your exact destination to our Ilanji bakery. The driving-route estimate to the mapped Mekkarai village point is about 16.1 km, within the 20 km limit at that point. Addresses beyond the village point need their own route check.',
    heading: 'Mekkarai village and other Mekkara endpoints need separate checks',
    paragraphs: [
      'A search result for a dam, a road or a nearby locality can describe a different endpoint from Mekkarai village. This page uses the village coordinates shown below. Include your venue or home pin instead of asking us to infer it from a similarly named attraction.',
      'Because the remaining distance from the village to your address matters to the 20 km boundary, confirm coverage before settling the cake and payment. Tell us if the recipient needs a particular handover point. For photo, themed or tiered cakes, discuss the design and transport arrangements early; the route estimate is not a delivery-time promise.',
    ],
    question: 'Does a route to Mekkara dam confirm my delivery?',
    answer: 'No. A dam route and a village-address route can have different endpoints. Send your actual destination and we will check the road distance from the bakery and the available arrangements.',
    related: ['panpoli', 'puliyarai'],
  },
];

export const deliveryAreaPath = area => `/cake-delivery/${area.slug}`;
export const findDeliveryArea = slug => DELIVERY_AREA_PAGES.find(area => area.slug === slug);
