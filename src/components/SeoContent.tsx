import Link from "next/link";

export type SeoPageKey =
  | "volume"
  | "cubic"
  | "cubic_feet"
  | "cubic_yard"
  | "cbm"
  | "concrete_volume"
  | "room_volume"
  | "tank_volume"
  | "soil";

type RelatedCalculator = {
  href: string;
  label: string;
  note: string;
};

type SeoContentPage = {
  keyword: string;
  heading: string;
  intro: string;
  formula: {
    title: string;
    text: string;
  };
  example: {
    title: string;
    input: string;
    calculation: string;
    result: string;
  };
  unitNotes: string[];
  uses: string[];
  mistakes: string[];
  faqs: Array<{ question: string; answer: string }>;
  related: RelatedCalculator[];
};

const content: Record<SeoPageKey, SeoContentPage> = {
  volume: {
    keyword: "volume calculator",
    heading: "Volume calculator guide",
    intro:
      "Use this volume calculator when the main task is finding how much space a measured object, room, container, or material section occupies.",
    formula: {
      title: "Basic volume formula",
      text:
        "For a rectangular shape, volume = length x width x height. Other shapes use their matching solid-geometry formula before the result is converted into the selected output units.",
    },
    example: {
      title: "Example volume calculation",
      input: "A box is 2 m long, 1.5 m wide, and 0.8 m high.",
      calculation: "2 x 1.5 x 0.8 = 2.4",
      result: "The volume is 2.4 m3 before any waste, quantity, or material setting is applied.",
    },
    unitNotes: [
      "Keep all dimensions in the same length unit when checking the formula by hand.",
      "Use cubic meters for general metric volume and cubic feet for common US room or storage estimates.",
      "Use liters or gallons when the volume represents liquid capacity.",
    ],
    uses: ["General object volume", "Storage space checks", "Container capacity", "Mixed-shape estimates"],
    mistakes: [
      "Mixing inches, feet, and meters in a manual formula without converting first.",
      "Using area units when the measurement needs depth or height to become volume.",
      "Forgetting quantity when several identical objects need one total.",
    ],
    faqs: [
      {
        question: "What does a volume calculator measure?",
        answer:
          "A volume calculator measures three-dimensional space. It uses dimensions such as length, width, height, radius, depth, or diameter depending on the selected shape.",
      },
      {
        question: "What is the easiest way to calculate volume?",
        answer:
          "For a rectangular object, multiply length by width by height. For cylinders, cones, spheres, and combined shapes, use the shape-specific formula in the calculator.",
      },
      {
        question: "Can I calculate volume with different units?",
        answer:
          "Yes. Enter the dimensions in the unit you measured, then read the converted volume in the result panel.",
      },
      {
        question: "Is volume the same as capacity?",
        answer:
          "Volume is the amount of three-dimensional space. Capacity is usually the usable amount a container can hold, so the terms can match for a full container but may differ in real use.",
      },
      {
        question: "Should I add waste to a volume result?",
        answer:
          "Add waste only when the result will be used for ordering material or when site variation matters. Pure geometry checks usually use zero waste.",
      },
    ],
    related: [
      { href: "/cubic-calculator", label: "cubic calculator", note: "Use for multi-shape cubic measurements." },
      { href: "/cubic-feet-calculator", label: "cubic feet calculator", note: "Use when the final unit should be ft3." },
      { href: "/tank-volume-calculator", label: "tank volume calculator", note: "Use when the measured shape is a tank." },
    ],
  },
  cubic: {
    keyword: "cubic calculator",
    heading: "Cubic calculator guide",
    intro:
      "Use this cubic calculator when the result needs to describe cubic measurement across one or more solid shapes.",
    formula: {
      title: "Cubic measurement formula",
      text:
        "For a box, cubic measurement = length x width x height. For combined objects, calculate each component, add included components, and subtract voids.",
    },
    example: {
      title: "Example cubic calculation",
      input: "One section is 4 ft x 3 ft x 2 ft and another section adds 2 ft x 2 ft x 1 ft.",
      calculation: "(4 x 3 x 2) + (2 x 2 x 1) = 28",
      result: "The combined cubic measurement is 28 ft3 before unit conversion.",
    },
    unitNotes: [
      "Cubic measurement always combines three dimensions.",
      "A cubic unit changes quickly when the length unit changes, so convert before comparing results.",
      "Use subtract mode for holes, cut-outs, or empty sections.",
    ],
    uses: ["Boxes and crates", "Combined shapes", "Cut-out checks", "Quantity totals"],
    mistakes: [
      "Calculating only surface area instead of a three-dimensional result.",
      "Adding a cut-out instead of subtracting it from the total.",
      "Rounding dimensions too early before combining components.",
    ],
    faqs: [
      {
        question: "What is a cubic calculator used for?",
        answer:
          "A cubic calculator is used to calculate a three-dimensional measurement from length, width, height, radius, depth, or shape-specific dimensions.",
      },
      {
        question: "How do I calculate cubic measurement?",
        answer:
          "For a rectangular shape, multiply length by width by height. For mixed shapes, calculate each component and combine the totals.",
      },
      {
        question: "Can the cubic calculator subtract volume?",
        answer:
          "Yes. Set a component to subtract when it represents a void, sleeve, hole, opening, or removed section.",
      },
      {
        question: "Can I use the cubic calculator for cylinders?",
        answer:
          "Yes. Choose the cylinder shape and enter radius or diameter-related dimensions shown by the calculator.",
      },
      {
        question: "Does quantity change the cubic result?",
        answer:
          "Yes. Quantity multiplies the component volume, so it should be set before using the final total.",
      },
    ],
    related: [
      { href: "/", label: "volume calculator", note: "Use for broad volume calculations." },
      { href: "/cubic-feet-calculator", label: "cubic feet calculator", note: "Use for ft3 output." },
      { href: "/cubic-yard-calculator", label: "cubic yard calculator", note: "Use for yd3 output." },
    ],
  },
  cubic_feet: {
    keyword: "cubic feet calculator",
    heading: "Cubic feet calculator guide",
    intro:
      "Use this cubic feet calculator when measurements are in feet or inches and the result needs to be shown in ft3.",
    formula: {
      title: "Cubic feet formula",
      text:
        "For a rectangular shape, cubic feet = length in feet x width in feet x height in feet. If dimensions are in inches, convert each dimension to feet first.",
    },
    example: {
      title: "Example cubic feet calculation",
      input: "A storage box is 6 ft long, 3 ft wide, and 2 ft high.",
      calculation: "6 x 3 x 2 = 36",
      result: "The box volume is 36 ft3.",
    },
    unitNotes: [
      "12 inches equals 1 foot, so divide inch dimensions by 12 before multiplying by hand.",
      "1 cubic yard equals 27 cubic feet.",
      "Cubic feet are useful for room volume, storage, boxes, and US material estimates.",
    ],
    uses: ["Room volume in ft3", "Storage boxes", "Moving and packing", "Air volume estimates"],
    mistakes: [
      "Dividing the final cubic inches result by 12 instead of by 1728.",
      "Using square feet when the height or depth is missing.",
      "Forgetting that each inch dimension must be converted before multiplying.",
    ],
    faqs: [
      {
        question: "How do I calculate cubic feet?",
        answer:
          "Multiply length, width, and height in feet. If a dimension is in inches, convert it to feet before multiplying.",
      },
      {
        question: "How many cubic feet are in one cubic yard?",
        answer: "One cubic yard contains 27 cubic feet.",
      },
      {
        question: "Can I calculate cubic feet from inches?",
        answer:
          "Yes. The calculator can accept inch dimensions and convert the result to cubic feet.",
      },
      {
        question: "Is cubic feet the same as square feet?",
        answer:
          "No. Square feet measure area with two dimensions. Cubic feet measure volume with three dimensions.",
      },
      {
        question: "When should I use a cubic feet calculator?",
        answer:
          "Use it when storage, room volume, box volume, or a supplier reference uses ft3 as the final unit.",
      },
    ],
    related: [
      { href: "/cubic-yard-calculator", label: "cubic yard calculator", note: "Use when the final unit should be yd3." },
      { href: "/room-volume-calculator", label: "room volume calculator", note: "Use for room-focused dimensions." },
      { href: "/", label: "volume calculator", note: "Use for general volume output." },
    ],
  },
  cubic_yard: {
    keyword: "cubic yard calculator",
    heading: "Cubic yard calculator guide",
    intro:
      "Use this cubic yard calculator when a project or supplier quotes material by yd3 and you need to convert measured dimensions into cubic yards.",
    formula: {
      title: "Cubic yard formula",
      text:
        "If dimensions are in feet, cubic yards = length x width x depth / 27. If dimensions are in yards, multiply length x width x depth directly.",
    },
    example: {
      title: "Example cubic yard calculation",
      input: "A measured area is 12 ft long, 9 ft wide, and 0.5 ft deep.",
      calculation: "12 x 9 x 0.5 / 27 = 2",
      result: "The project needs 2 yd3 before waste or rounding.",
    },
    unitNotes: [
      "Use feet for length, width, and depth when dividing by 27.",
      "Use decimal feet for depth if the depth is measured in inches.",
      "Round according to supplier bag, truck, or batch sizing after the calculation.",
    ],
    uses: ["Bulk material orders", "Fill volume", "Landscape material", "Concrete quantity checks"],
    mistakes: [
      "Using inches for depth without converting to feet.",
      "Rounding down when supplier sizing requires whole bags, scoops, or truck loads.",
      "Confusing cubic yards with square yards.",
    ],
    faqs: [
      {
        question: "How do I calculate cubic yards?",
        answer:
          "Multiply length, width, and depth in feet, then divide by 27. If all dimensions are already in yards, multiply them directly.",
      },
      {
        question: "Why do I divide by 27 for cubic yards?",
        answer:
          "One yard is 3 feet, so one cubic yard is 3 x 3 x 3, or 27 cubic feet.",
      },
      {
        question: "Can I use inches for depth?",
        answer:
          "Yes. Convert inches to feet first by dividing by 12, then use the cubic yard formula.",
      },
      {
        question: "Should I add extra cubic yards when ordering?",
        answer:
          "For material orders, many users add a waste or rounding allowance because dimensions, compaction, and supplier sizing vary.",
      },
      {
        question: "Is a cubic yard calculator only for landscaping?",
        answer:
          "No. It is also useful for concrete, fill, gravel, excavation, and other projects quoted in yd3.",
      },
    ],
    related: [
      { href: "/concrete-volume-calculator", label: "concrete volume calculator", note: "Use for concrete-specific dimensions." },
      { href: "/soil-volume-calculator", label: "soil calculator", note: "Use for soil and bed depth estimates." },
      { href: "/cubic-feet-calculator", label: "cubic feet calculator", note: "Use when the result should stay in ft3." },
    ],
  },
  cbm: {
    keyword: "CBM calculator",
    heading: "CBM calculator guide",
    intro:
      "Use this CBM calculator when a shipment needs cubic meter volume from carton dimensions and quantity.",
    formula: {
      title: "CBM formula",
      text:
        "CBM = length in meters x width in meters x height in meters x quantity. If measurements are in centimeters, divide each dimension by 100 before multiplying.",
    },
    example: {
      title: "Example CBM calculation",
      input: "A carton is 60 cm long, 40 cm wide, and 35 cm high. Quantity is 20 cartons.",
      calculation: "0.6 x 0.4 x 0.35 x 20 = 1.68",
      result: "The shipment volume is 1.68 CBM.",
    },
    unitNotes: [
      "CBM is cubic meters, commonly used in freight and cargo quotes.",
      "Centimeter dimensions must be converted to meters before multiplying.",
      "Volumetric weight depends on the divisor required by the carrier.",
    ],
    uses: ["Carton volume", "Freight quote checks", "Shipment summaries", "Volumetric weight review"],
    mistakes: [
      "Multiplying centimeter dimensions without converting to meters.",
      "Forgetting carton quantity.",
      "Using volumetric weight as a replacement for actual cargo volume.",
    ],
    faqs: [
      {
        question: "What does CBM mean?",
        answer:
          "CBM means cubic meter. It is a freight volume unit calculated from length, width, and height.",
      },
      {
        question: "How do I calculate CBM for cartons?",
        answer:
          "Convert carton dimensions to meters, multiply length by width by height, then multiply by carton quantity.",
      },
      {
        question: "Can I enter carton dimensions in centimeters?",
        answer:
          "Yes. The calculator can convert centimeter dimensions before showing the CBM result.",
      },
      {
        question: "Is CBM the same as chargeable weight?",
        answer:
          "No. CBM is volume. Chargeable weight compares actual weight with volumetric weight using the carrier divisor.",
      },
      {
        question: "Which divisor should I use for volumetric weight?",
        answer:
          "Use the divisor provided by the carrier or freight forwarder. Common examples include 5000 and 6000, but the correct value depends on the service.",
      },
    ],
    related: [
      { href: "/cubic-feet-calculator", label: "cubic feet calculator", note: "Use for ft3 freight references." },
      { href: "/", label: "volume calculator", note: "Use for non-shipping volume." },
      { href: "/cubic-calculator", label: "cubic calculator", note: "Use for mixed solid shapes." },
    ],
  },
  concrete_volume: {
    keyword: "concrete volume calculator",
    heading: "Concrete volume calculator guide",
    intro:
      "Use this concrete volume calculator when the result needs to estimate the amount of concrete required from measured dimensions.",
    formula: {
      title: "Concrete volume formula",
      text:
        "Concrete volume is the sum of added pour sections minus subtracted openings or voids. A waste percentage can then be applied to the net volume.",
    },
    example: {
      title: "Example concrete volume calculation",
      input: "A slab is 20 ft long, 10 ft wide, and 0.5 ft thick.",
      calculation: "20 x 10 x 0.5 / 27 = 3.7",
      result: "The slab is about 3.7 yd3 before waste.",
    },
    unitNotes: [
      "Concrete orders are often rounded after converting volume to yd3 or m3.",
      "Use subtract mode for holes, sleeves, drains, or openings.",
      "A waste factor accounts for site variation, spillage, and ordering margin.",
    ],
    uses: ["Slabs", "Footings", "Columns", "Trenches", "Openings and voids"],
    mistakes: [
      "Using slab area without multiplying by thickness.",
      "Entering inches of thickness as feet without conversion.",
      "Forgetting to subtract large openings or voids.",
    ],
    faqs: [
      {
        question: "How do I calculate concrete volume?",
        answer:
          "Calculate each concrete section from its dimensions, subtract voids, then apply any waste allowance needed for the project.",
      },
      {
        question: "Why does concrete thickness matter?",
        answer:
          "Thickness is the third dimension that turns slab area into volume. Without thickness, the result is only area.",
      },
      {
        question: "Can this concrete volume calculator subtract holes?",
        answer:
          "Yes. Add a component for the hole or void and set it to subtract from the total.",
      },
      {
        question: "Should I include waste for concrete?",
        answer:
          "Usually yes for ordering. The right allowance depends on site conditions, supplier guidance, and project tolerance.",
      },
      {
        question: "Is this concrete volume calculator structural advice?",
        answer:
          "No. It estimates quantity from dimensions. Structural design and safety decisions should be checked by a qualified professional.",
      },
    ],
    related: [
      { href: "/cubic-yard-calculator", label: "cubic yard calculator", note: "Use when only yd3 conversion is needed." },
      { href: "/", label: "volume calculator", note: "Use for non-concrete shapes." },
      { href: "/cubic-calculator", label: "cubic calculator", note: "Use for mixed geometry checks." },
    ],
  },
  room_volume: {
    keyword: "room volume calculator",
    heading: "Room volume calculator guide",
    intro:
      "Use this room volume calculator when the main task is finding the volume of a room, storage space, or shaped interior.",
    formula: {
      title: "Room volume formula",
      text:
        "For a rectangular room, room volume = length x width x height. For L-shaped or irregular rooms, split the room into sections and add the volumes.",
    },
    example: {
      title: "Example room volume calculation",
      input: "A room is 14 ft long, 11 ft wide, and 8 ft high.",
      calculation: "14 x 11 x 8 = 1232",
      result: "The room volume is 1232 ft3.",
    },
    unitNotes: [
      "Use cubic feet for many US room and air-volume references.",
      "Use cubic meters when room dimensions are measured in metric units.",
      "For irregular rooms, measure each section separately before adding them.",
    ],
    uses: ["Bedrooms and living rooms", "Closets", "Storage rooms", "Warehouses", "L-shaped rooms"],
    mistakes: [
      "Using floor area without multiplying by ceiling height.",
      "Ignoring alcoves, returns, or bay sections in an irregular room.",
      "Using outside building dimensions when interior volume is needed.",
    ],
    faqs: [
      {
        question: "How do I calculate room volume?",
        answer:
          "For a rectangular room, multiply length by width by height. For shaped rooms, calculate each section and add the volumes.",
      },
      {
        question: "Can I calculate an L-shaped room?",
        answer:
          "Yes. Use an L-shaped layout or split the room into rectangular sections and combine them.",
      },
      {
        question: "Is room volume the same as floor area?",
        answer:
          "No. Floor area uses length and width. Room volume also includes height.",
      },
      {
        question: "Which unit should I use for room volume?",
        answer:
          "Use the unit required by your reference. Cubic feet and cubic meters are the most common room volume outputs.",
      },
      {
        question: "Can a sloped ceiling be estimated?",
        answer:
          "A simple sloped section can be estimated with a triangular prism component, but detailed interiors may need a more specific model.",
      },
    ],
    related: [
      { href: "/cubic-feet-calculator", label: "cubic feet calculator", note: "Use for ft3 room output." },
      { href: "/", label: "volume calculator", note: "Use for general volume." },
      { href: "/cubic-calculator", label: "cubic calculator", note: "Use for combined interior sections." },
    ],
  },
  tank_volume: {
    keyword: "tank volume calculator",
    heading: "Tank volume calculator guide",
    intro:
      "Use this tank volume calculator when a tank or vessel needs a full-volume estimate from its shape and dimensions.",
    formula: {
      title: "Tank volume formula",
      text:
        "Tank volume depends on the tank shape. A rectangular tank uses length x width x height, while a cylindrical tank uses pi x radius squared x length or height.",
    },
    example: {
      title: "Example tank volume calculation",
      input: "A rectangular tank is 1.2 m long, 0.8 m wide, and 0.6 m high.",
      calculation: "1.2 x 0.8 x 0.6 = 0.576",
      result: "The full tank volume is 0.576 m3, or about 576 liters.",
    },
    unitNotes: [
      "1 m3 equals 1000 liters.",
      "Liquid capacity is often shown in liters, US gallons, or UK gallons.",
      "This page estimates full tank volume, not partial fill level.",
    ],
    uses: ["Water tanks", "Rectangular containers", "Cylindrical tanks", "Bins and vessels"],
    mistakes: [
      "Using diameter as radius in a cylinder formula.",
      "Measuring outside dimensions when inside capacity is needed.",
      "Assuming a partial fill result when the calculation is full capacity.",
    ],
    faqs: [
      {
        question: "How do I calculate tank volume?",
        answer:
          "Choose the tank shape, enter the required dimensions, and convert the resulting volume into liquid units if needed.",
      },
      {
        question: "How many liters are in one cubic meter?",
        answer: "One cubic meter equals 1000 liters.",
      },
      {
        question: "Can this tank volume calculator handle cylinders?",
        answer:
          "Yes. Choose a cylindrical tank shape and enter the required dimensions.",
      },
      {
        question: "Does this calculate partial tank fill?",
        answer:
          "No. This calculator estimates full tank volume. Partial fill calculations need fill height or level data.",
      },
      {
        question: "Should I use inside or outside tank dimensions?",
        answer:
          "Use inside dimensions when you need usable capacity. Outside dimensions may overstate the actual tank volume.",
      },
    ],
    related: [
      { href: "/", label: "volume calculator", note: "Use for general shape volume." },
      { href: "/cubic-calculator", label: "cubic calculator", note: "Use for mixed solid shapes." },
      { href: "/cubic-feet-calculator", label: "cubic feet calculator", note: "Use when tank volume is needed in ft3." },
    ],
  },
  soil: {
    keyword: "soil calculator",
    heading: "Soil calculator guide",
    intro:
      "Use this soil calculator when the result needs to estimate soil quantity from a measured area and depth.",
    formula: {
      title: "Soil quantity formula",
      text:
        "For a rectangular bed, soil volume = length x width x depth. Convert the result into liters, cubic feet, or cubic yards for ordering.",
    },
    example: {
      title: "Example soil calculation",
      input: "A raised bed is 8 ft long, 4 ft wide, and 1 ft deep.",
      calculation: "8 x 4 x 1 = 32",
      result: "The bed needs 32 ft3 of soil before waste or bag-size rounding.",
    },
    unitNotes: [
      "Depth is often the dimension most likely to be measured in inches.",
      "Convert inch depth to feet by dividing by 12 before calculating by hand.",
      "Use supplier bag size after the volume result to estimate bag count.",
    ],
    uses: ["Raised beds", "Planters", "Garden fill", "Trenches", "Soil replacement"],
    mistakes: [
      "Using surface area without adding soil depth.",
      "Forgetting compaction or settling when ordering material.",
      "Dividing by bag size before converting both values to the same unit.",
    ],
    faqs: [
      {
        question: "How do I calculate soil quantity?",
        answer:
          "Multiply the measured area by the fill depth, then convert the result into the unit used by the supplier.",
      },
      {
        question: "Can I use inches for soil depth?",
        answer:
          "Yes. Convert inches to feet or choose the correct unit in the calculator before reading the result.",
      },
      {
        question: "Should I add extra soil?",
        answer:
          "Many garden projects need a small allowance because soil can settle, compact, or vary by bag size.",
      },
      {
        question: "Can this soil calculator estimate raised beds?",
        answer:
          "Yes. Enter the bed length, width, and fill depth to estimate the soil volume.",
      },
      {
        question: "How do I convert soil volume to bags?",
        answer:
          "Convert the total soil volume into the same unit shown on the bag, then divide by the bag size and round up.",
      },
    ],
    related: [
      { href: "/cubic-yard-calculator", label: "cubic yard calculator", note: "Use for yd3 material orders." },
      { href: "/", label: "volume calculator", note: "Use for general volume checks." },
      { href: "/concrete-volume-calculator", label: "concrete volume calculator", note: "Use for concrete instead of soil." },
    ],
  },
};

interface SeoContentProps {
  page: SeoPageKey;
}

export function SeoContent({ page }: SeoContentProps) {
  const data = content[page];

  return (
    <section className="seo-content" aria-labelledby="seo-content-title">
      <div className="seo-content-head">
        <p className="eyebrow">Guide</p>
        <h2 id="seo-content-title">{data.heading}</h2>
        <p>{data.intro}</p>
      </div>

      <div className="seo-grid">
        <article>
          <h3>{data.formula.title}</h3>
          <p>{data.formula.text}</p>
        </article>
        <article>
          <h3>{data.example.title}</h3>
          <p>{data.example.input}</p>
          <p>
            <strong>{data.example.calculation}</strong>
          </p>
          <p>{data.example.result}</p>
        </article>
        <article>
          <h3>Unit notes</h3>
          <ul>
            {data.unitNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </article>
        <article>
          <h3>Best uses</h3>
          <ul>
            {data.uses.map((use) => (
              <li key={use}>{use}</li>
            ))}
          </ul>
        </article>
      </div>

      <div className="seo-detail-grid">
        <article className="seo-list-panel">
          <h3>Common mistakes</h3>
          <ul>
            {data.mistakes.map((mistake) => (
              <li key={mistake}>{mistake}</li>
            ))}
          </ul>
        </article>

        <article className="seo-list-panel">
          <h3>Related calculators</h3>
          <div className="related-calculator-list">
            {data.related.map((item) => (
              <Link href={item.href} key={item.href}>
                <strong>{item.label}</strong>
                <span>{item.note}</span>
              </Link>
            ))}
          </div>
        </article>
      </div>

      <div className="faq-grid" aria-label={`${data.keyword} frequently asked questions`}>
        {data.faqs.map((faq) => (
          <details key={faq.question}>
            <summary>{faq.question}</summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>

      <p className="disclaimer">
        This calculator provides estimates based on the dimensions and assumptions you enter. For engineering,
        structural, freight, or purchasing decisions, verify the result with a qualified professional or supplier.
      </p>
    </section>
  );
}
