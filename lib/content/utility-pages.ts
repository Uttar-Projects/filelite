import type { FaqItem } from "@/lib/seo/schema";

export type UtilityPage = {
  slug: string;
  path: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  when: string[];
  steps: string[];
  notes: string;
  faqs: FaqItem[];
  related: string[];
};

export const utilityPages: Record<string, UtilityPage> = {
  "word-counter": {
    slug: "word-counter",
    path: "/word-counter",
    title: "Free Word Counter Online – Count Words & Characters",
    description:
      "Free word counter online. Count words, characters, sentences, and paragraphs, plus reading time and keyword density. Runs in your browser.",
    h1: "Free Word Counter",
    intro: "Use this free word counter to paste text and count words, characters, sentences, and reading time. Nothing is uploaded.",
    when: [
      "A form or assignment has a word limit.",
      "You want a reading-time estimate before you publish.",
      "You need a quick look at repeated keywords.",
    ],
    steps: ["Paste or type your text.", "Read the live totals.", "Scan keyword density if you are editing for search."],
    notes: "Words are letters and numbers. Common stop words are left out of the density list.",
    faqs: [
      {
        question: "How is reading time calculated?",
        answer: "The tool divides the word count by 200 words per minute, a common silent-reading pace.",
      },
      {
        question: "Are spaces counted?",
        answer: "Yes. You get both the full character count and a count without spaces.",
      },
      {
        question: "Does the text leave my browser?",
        answer: "No. Counting happens locally.",
      },
    ],
    related: ["case-converter", "slug-generator", "text-diff"],
  },
  "case-converter": {
    slug: "case-converter",
    path: "/case-converter",
    title: "Free Case Converter Online – UPPER, lower, Title Case",
    description:
      "Free case converter online. Change text to UPPER CASE, lower case, Title Case, camelCase, snake_case, or kebab-case.",
    h1: "Free Case Converter",
    intro: "Change letter case or programming case styles without a spreadsheet formula.",
    when: [
      "You need a heading in title case.",
      "A variable name has to move between camelCase and snake_case.",
      "A block of text arrived in all caps.",
    ],
    steps: ["Paste the text.", "Choose a case.", "Copy the result."],
    notes: "camelCase, PascalCase, snake_case, kebab-case, and CONSTANT_CASE split on spaces, dashes, and capitals.",
    faqs: [
      {
        question: "What is Title Case here?",
        answer: "Each word gets a capital first letter. Small words are not treated as a special list.",
      },
      {
        question: "Will punctuation stay?",
        answer: "Upper, lower, title, and sentence case keep punctuation. Programming cases keep only letters and numbers.",
      },
      {
        question: "Can I convert code identifiers?",
        answer: "Yes. camelCase and snake_case are meant for names, not full sentences.",
      },
    ],
    related: ["slug-generator", "word-counter", "json-formatter"],
  },
  "slug-generator": {
    slug: "slug-generator",
    path: "/slug-generator",
    title: "Free Slug Generator Online – URL Slug from Any Title",
    description: "Free slug generator online. Turn a title into a URL-safe slug. Accents are stripped and spaces become hyphens.",
    h1: "Free Slug Generator",
    intro: "Make a clean path from a headline for blogs, docs, or product URLs.",
    when: [
      "You are writing a page title and need the path.",
      "Imported titles contain accents or punctuation.",
      "You want hyphens instead of underscores.",
    ],
    steps: ["Paste the title.", "Choose a hyphen or underscore.", "Copy the slug."],
    notes: "The slug is lowercased, accents are removed, and the result is capped at 180 characters.",
    faqs: [
      {
        question: "Are accents kept?",
        answer: "No. They are converted to ASCII so the slug stays readable in a URL.",
      },
      {
        question: "Can I use underscores?",
        answer: "Yes. Switch the separator if your CMS prefers them.",
      },
      {
        question: "Is the slug unique?",
        answer: "The tool does not check your site. Add a number if two titles collide.",
      },
    ],
    related: ["case-converter", "url-encoder", "lorem-ipsum"],
  },
  "lorem-ipsum": {
    slug: "lorem-ipsum",
    path: "/lorem-ipsum",
    title: "Free Lorem Ipsum Generator – Dummy Text Online",
    description: "Free Lorem Ipsum generator. Create dummy placeholder text by paragraphs or words in your browser.",
    h1: "Free Lorem Ipsum Generator",
    intro: "Fill a layout with dummy Latin so you can judge spacing before the real copy arrives.",
    when: [
      "A design mock needs body text.",
      "You want a fixed word count for a prototype.",
      "You prefer the classic opening sentence.",
    ],
    steps: ["Choose paragraphs or words.", "Set the count.", "Generate and copy."],
    notes: "The word list is the usual Cicero excerpt. The output is repeatable, not random poetry.",
    faqs: [
      {
        question: "Is this real Latin?",
        answer: "It is a scrambled passage from Cicero, used as filler, not as a translation.",
      },
      {
        question: "Can I start without “Lorem ipsum”?",
        answer: "Yes. Turn off the classic opening if you want a generic block.",
      },
      {
        question: "How long can it be?",
        answer: "Up to 40 paragraphs or 40 words in one click. Generate again if you need more.",
      },
    ],
    related: ["markdown-preview", "word-counter", "case-converter"],
  },
  "text-diff": {
    slug: "text-diff",
    path: "/text-diff",
    title: "Free Text Compare Online – Diff Checker",
    description: "Free text compare and diff checker. Compare two texts line by line and highlight added and removed lines.",
    h1: "Free Text Diff Checker",
    intro: "See what changed between two drafts, configs, or notes without sending them to a server.",
    when: [
      "Two versions of a paragraph need a check.",
      "A config file changed and you want the delta.",
      "You are reviewing copy edits.",
    ],
    steps: ["Paste the original on the left.", "Paste the new text on the right.", "Read added and removed lines."],
    notes: "Very large files are refused so the page stays responsive. Split them if needed.",
    faqs: [
      {
        question: "Is this a word-level diff?",
        answer: "No. It compares whole lines. A changed word marks the entire line.",
      },
      {
        question: "Does order matter?",
        answer: "Yes. The left side is treated as the original.",
      },
      {
        question: "Are my drafts stored?",
        answer: "No. They stay in the page until you leave.",
      },
    ],
    related: ["word-counter", "json-formatter", "markdown-preview"],
  },
  "markdown-preview": {
    slug: "markdown-preview",
    path: "/markdown-preview",
    title: "Free Markdown Preview Online – Markdown to HTML",
    description: "Free Markdown preview online. Render Markdown as HTML in your browser, including headings, lists, links, and code.",
    h1: "Free Markdown Preview",
    intro: "Type Markdown on the left and read a live preview on the right.",
    when: [
      "You are drafting a README.",
      "You want to check a heading before you publish.",
      "You need a safe preview that does not run scripts.",
    ],
    steps: ["Paste Markdown.", "Check the preview.", "Copy the source when it looks right."],
    notes: "HTML in the source is escaped. This is a common-mark subset, not a full CommonMark implementation.",
    faqs: [
      {
        question: "Can I paste raw HTML?",
        answer: "Tags are shown as text so a pasted script cannot run.",
      },
      {
        question: "Are tables supported?",
        answer: "Not yet. Use headings, lists, quotes, code, bold, italic, and links.",
      },
      {
        question: "Does this replace a static-site build?",
        answer: "No. It is a preview for drafting.",
      },
    ],
    related: ["text-diff", "lorem-ipsum", "word-counter"],
  },
  "json-formatter": {
    slug: "json-formatter",
    path: "/json-formatter",
    title: "Free JSON Formatter Online – Beautify, Minify, Validate",
    description: "Free JSON formatter online. Beautify, minify, and validate JSON in your browser. Invalid JSON shows the error.",
    h1: "Free JSON Formatter",
    intro: "Pretty-print or compress a JSON payload and see parse errors next to the input.",
    when: [
      "An API response arrived in one line.",
      "You need a minified body for a request.",
      "A config file failed to parse and you want the reason.",
    ],
    steps: ["Paste JSON.", "Choose format or minify.", "Fix the error if validation fails."],
    notes: "The browser JSON parser is used. Trailing commas and comments are rejected.",
    faqs: [
      {
        question: "Does it change key order?",
        answer: "Modern engines usually keep the order you pasted.",
      },
      {
        question: "Can I format JSON with comments?",
        answer: "No. JSON does not allow comments. Remove them first.",
      },
      {
        question: "Is the payload sent anywhere?",
        answer: "No. Formatting stays on your device.",
      },
    ],
    related: ["base64", "url-encoder", "text-diff"],
  },
  base64: {
    slug: "base64",
    path: "/base64",
    title: "Free Base64 Encoder Decoder Online",
    description: "Free Base64 encoder and decoder online. Encode and decode Base64 text, including Unicode, in your browser.",
    h1: "Free Base64 Encoder Decoder",
    intro: "Turn text into Base64 or recover the original string. UTF-8 is used so non-English text survives.",
    when: [
      "An API expects a Base64 body.",
      "You received a token and want to read it.",
      "You need to move small text through a binary-safe field.",
    ],
    steps: ["Paste text or Base64.", "Encode or decode.", "Copy the result."],
    notes: "This is a string tool, not a file uploader. Large files belong in a dedicated encoder.",
    faqs: [
      {
        question: "Does this handle Unicode?",
        answer: "Yes. Text is encoded as UTF-8 before Base64.",
      },
      {
        question: "Why did decode fail?",
        answer: "The input was not valid Base64, or it was missing padding.",
      },
      {
        question: "Can I encode images?",
        answer: "Not here. Use a file tool if you need data URLs from pictures.",
      },
    ],
    related: ["url-encoder", "hash-generator", "json-formatter"],
  },
  "url-encoder": {
    slug: "url-encoder",
    path: "/url-encoder",
    title: "Free URL Encoder Decoder Online",
    description: "Free URL encoder and decoder online. Percent-encode and decode URLs and query strings in your browser.",
    h1: "Free URL Encoder Decoder",
    intro: "Escape spaces and reserved characters for a query string, or turn them back into readable text.",
    when: [
      "A search query has to sit inside a URL.",
      "You received a percent-encoded title.",
      "You need to choose between encoding a full URL and a single component.",
    ],
    steps: ["Paste the value.", "Encode or decode.", "Use component mode for query values."],
    notes: "Component mode uses encodeURIComponent. Full-URL mode leaves : / ? # in place.",
    faqs: [
      {
        question: "When should I encode a component?",
        answer: "When the text is one query value, not the entire address.",
      },
      {
        question: "Are plus signs treated as spaces?",
        answer: "On decode, + becomes a space, which matches form encoding.",
      },
      {
        question: "Can this fix a broken URL?",
        answer: "It only encodes or decodes. It does not rewrite hosts or paths.",
      },
    ],
    related: ["slug-generator", "base64", "json-formatter"],
  },
  "uuid-generator": {
    slug: "uuid-generator",
    path: "/uuid-generator",
    title: "Free UUID Generator Online – Version 4",
    description: "Free UUID generator online. Create RFC 4122 version 4 UUIDs in batches with the browser crypto API.",
    h1: "Free UUID Generator",
    intro: "Create one or many random UUIDs for test data, keys, or local identifiers.",
    when: [
      "A fixture needs unique ids.",
      "You want several UUIDs at once.",
      "You do not want an online generator that logs requests.",
    ],
    steps: ["Set how many to create.", "Generate.", "Copy the list."],
    notes: "These are version 4 UUIDs from crypto.randomUUID. They are random, not time-based.",
    faqs: [
      {
        question: "Are these unique?",
        answer: "Collisions are extremely unlikely for normal use. They are not registered with a central service.",
      },
      {
        question: "Is this UUID v1?",
        answer: "No. Version 4 is random and does not include a MAC address.",
      },
      {
        question: "How many can I generate?",
        answer: "Up to 200 in one click so the page stays usable.",
      },
    ],
    related: ["password-generator", "hash-generator", "json-formatter"],
  },
  "timestamp-converter": {
    slug: "timestamp-converter",
    path: "/timestamp-converter",
    title: "Free Unix Timestamp Converter – Epoch to Date",
    description: "Free Unix timestamp converter. Turn epoch seconds or milliseconds into a date, and a date into Unix time.",
    h1: "Free Unix Timestamp Converter",
    intro: "Read a Unix time as a local date, or turn a date into seconds since 1970.",
    when: [
      "A log printed seconds since epoch.",
      "An API wants milliseconds.",
      "You need both UTC and local clock readings.",
    ],
    steps: ["Paste a timestamp or pick a date.", "Read seconds, milliseconds, ISO, UTC, and local time."],
    notes: "Values with 13 or more digits are treated as milliseconds. Shorter values are seconds.",
    faqs: [
      {
        question: "Is the result my timezone?",
        answer: "Local time uses this browser’s timezone. UTC is also shown.",
      },
      {
        question: "What about leap seconds?",
        answer: "Unix time as used here ignores leap seconds, like most software.",
      },
      {
        question: "Can I convert negative timestamps?",
        answer: "Yes, for dates before 1970, if the browser can represent them.",
      },
    ],
    related: ["json-formatter", "uuid-generator", "unit-converter"],
  },
  "password-generator": {
    slug: "password-generator",
    path: "/password-generator",
    title: "Free Password Generator Online – Strong Random Passwords",
    description: "Free password generator online. Create strong random passwords in your browser with length and character options.",
    h1: "Free Password Generator",
    intro: "Build a password from letters, numbers, and symbols. Generation uses the page, not a remote API.",
    when: [
      "You need a new password and do not want a cloud generator.",
      "A form asks for symbols and a minimum length.",
      "You want to avoid look-alike characters.",
    ],
    steps: ["Set length and character types.", "Generate.", "Copy the password and store it in a manager."],
    notes: "When Web Crypto is available, bytes come from crypto.getRandomValues. The password is not saved.",
    faqs: [
      {
        question: "Is this stored?",
        answer: "No. Refreshing the page clears it.",
      },
      {
        question: "Why did generation fail?",
        answer: "Turn on at least one character set. Similar-looking characters can empty a tiny set.",
      },
      {
        question: "Should I use this as a vault?",
        answer: "No. Copy the result into a password manager.",
      },
    ],
    related: ["hash-generator", "uuid-generator", "base64"],
  },
  "hash-generator": {
    slug: "hash-generator",
    path: "/hash-generator",
    title: "Free Hash Generator Online – SHA-256, SHA-512, SHA-1",
    description: "Free hash generator online. Create SHA-256, SHA-512, and SHA-1 hashes from text in your browser.",
    h1: "Free Hash Generator",
    intro: "Hash a string locally. Useful for checksums and quick comparisons, not for storing passwords.",
    when: [
      "You want a SHA-256 of a short string.",
      "Two files’ text should match a published hash.",
      "You are checking a token format.",
    ],
    steps: ["Paste the text.", "Pick SHA-1, SHA-256, or SHA-512.", "Copy the hex digest."],
    notes: "This hashes UTF-8 text. It is not a file checksum tool and not a password hasher with salt.",
    faqs: [
      {
        question: "Is SHA-1 safe for passwords?",
        answer: "No. Do not use this page to store passwords. Use a dedicated password hash with a salt.",
      },
      {
        question: "Why is SHA-1 still listed?",
        answer: "Some older checksums still publish SHA-1. Prefer SHA-256 for new work.",
      },
      {
        question: "Can I hash a file?",
        answer: "Not yet. Paste the text contents only.",
      },
    ],
    related: ["password-generator", "base64", "uuid-generator"],
  },
  "color-converter": {
    slug: "color-converter",
    path: "/color-converter",
    title: "Free Color Converter Online – HEX, RGB, and HSL",
    description: "Free color converter online. Convert HEX to RGB and HSL, with a live preview, in your browser.",
    h1: "Free Color Converter",
    intro: "Type a hex code or RGB values and get the other formats plus a swatch.",
    when: [
      "A design token is HEX and your CSS uses HSL.",
      "You want to check contrast against a preview.",
      "You copied an rgb() value from DevTools.",
    ],
    steps: ["Enter HEX, RGB, or HSL.", "Read the other formats.", "Copy the one you need."],
    notes: "Three-digit hex is expanded. HSL uses degrees and percentages.",
    faqs: [
      {
        question: "Is alpha supported?",
        answer: "Not in this version. Convert opaque colors only.",
      },
      {
        question: "Why did HEX reject my value?",
        answer: "Use three or six hex digits, with or without a leading #.",
      },
      {
        question: "Does the preview use the converted color?",
        answer: "Yes. The swatch updates from the current RGB.",
      },
    ],
    related: ["unit-converter", "case-converter", "json-formatter"],
  },
  "unit-converter": {
    slug: "unit-converter",
    path: "/unit-converter",
    title: "Free Unit Converter Online – Length, Weight, Temperature",
    description: "Free unit converter online. Convert length, weight, temperature, and file size in your browser.",
    h1: "Free Unit Converter",
    intro: "Switch between metric and imperial units, or between bytes and megabytes.",
    when: [
      "A spec is in inches and you work in millimetres.",
      "You need Celsius from Fahrenheit.",
      "A download size is listed in GiB-style megabytes.",
    ],
    steps: ["Choose a category.", "Pick from and to units.", "Enter a number."],
    notes: "Data units use 1024. Temperature uses the usual Celsius formulas.",
    faqs: [
      {
        question: "Are megabytes 1000 or 1024?",
        answer: "This converter uses 1024, which matches most operating-system file sizes.",
      },
      {
        question: "How exact is the result?",
        answer: "It uses standard conversion constants. Rounding is to six meaningful digits in the display.",
      },
      {
        question: "Can I convert currency?",
        answer: "No. Rates change and would need a network lookup.",
      },
    ],
    related: ["timestamp-converter", "color-converter", "word-counter"],
  },
};

export const utilityPageList = Object.values(utilityPages);
