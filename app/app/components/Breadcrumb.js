import Link from "next/link";

/**
 * Breadcrumb bar with the page title.
 *
 * The title renders as the page's `<h1>` by default. It used to be an `<h2>` while
 * the site's only `<h1>` was the logo in the header, so every page's strongest
 * heading said "Serles Bake" instead of what the page is about.
 *
 * Pages that already render their own `<h1>` in the body (blog index and posts,
 * contact, the legal pages) pass `headingLevel="h2"` so we don't create a second
 * one. The `h2` class is kept either way — this is semantics, not styling.
 */
export default function Breadcrumb({ title, items = [], headingLevel = "h1" }) {
  const Heading = headingLevel === "h1" ? "h1" : "h2";

  return (
    <div className="breadcrumb-option">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-6">
            <div className="breadcrumb__text ">
              <Heading className="text-uppercase h2">{title}</Heading>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6">
            <div className="breadcrumb__links">
              <Link href="/">Home</Link>
              {items.map((item, index) => (
                <span key={index}>
                  {item.href ? (
                    <Link href={item.href}>{item.label}</Link>
                  ) : (
                    item.label
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 