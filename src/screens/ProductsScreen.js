export default function ProductsScreen({
  screenRef,
  Header,
  PRODUCT_STRUCTURE,
  expandedProductCategory,
  setExpandedProductCategory,
  setStep,
  setLegalOverlay,
  setShowResetConfirm,
  setContactOverlay,
  ContactButton
}) {
  return (
    <div className="screen" ref={screenRef}>

    <Header
  back={() => setStep("dashboard")}
  goBase={() => setStep("base")}
/>

      <h2>Abschlussmöglichkeiten</h2>

      <div className="categoryList">
        {Object.keys(PRODUCT_STRUCTURE).map((key) => {
          const category = PRODUCT_STRUCTURE[key];
          const isOpen = expandedProductCategory === key;

          return (
            <div key={key}>
              <div
                className="categoryRow"
                onClick={() =>
                  setExpandedProductCategory(isOpen ? null : key)
                }
                style={{ cursor: "pointer" }}
              >
                <span>{category.label}</span>

                <div
                  className="categoryChevron"
                  style={{
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>

              {isOpen && (
                <div className="categoryDetails open">
                  {category.products.map((product, index) => (
                    <div key={index} className="productRow">
                      <div className="productName">
                        {product.name}
                      </div>

                      <button
                        className="productButton"
                        onClick={() =>
                          window.open(product.url, "_blank", "noopener,noreferrer")
                        }
                      >
                        jetzt Online absichern
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="legalFooter">
        <span onClick={() => setLegalOverlay("impressum")}>Impressum</span>
        {" | "}
        <span onClick={() => setLegalOverlay("datenschutz")}>Datenschutz</span>
        {" | "}
        <span onClick={() => setLegalOverlay("hinweis")}>Hinweis</span>
      </div>

      <ContactButton
        onReset={() => setShowResetConfirm(true)}
        onContact={() => setContactOverlay(true)}
      />

    </div>
  );
}