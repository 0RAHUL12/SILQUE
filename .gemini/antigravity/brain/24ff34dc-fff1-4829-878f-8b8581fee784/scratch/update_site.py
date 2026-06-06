import os
import re

def update_site():
    root_dir = r"c:\Users\rahul\Desktop\web\public"
    
    # 1. Update all 21 HTML footers to add FAQ link
    footer_pattern = r'<details class="footer-group"><summary>Company</summary><ul><li><a href="/about">About Us</a></li><li><a href="/contact">Contact Us</a></li><li><a href="/airlaid-napkins">What Is Airlaid</a></li></ul></details>'
    footer_replacement = '<details class="footer-group"><summary>Company</summary><ul><li><a href="/about">About Us</a></li><li><a href="/contact">Contact Us</a></li><li><a href="/airlaid-napkins">What Is Airlaid</a></li><li><a href="/faq">FAQ</a></li></ul></details>'
    
    updated_footers = 0
    for dirpath, _, filenames in os.walk(root_dir):
        for f in filenames:
            if f.endswith(".html"):
                path = os.path.join(dirpath, f)
                with open(path, "r", encoding="utf-8") as file:
                    content = file.read()
                
                if footer_pattern in content:
                    new_content = content.replace(footer_pattern, footer_replacement)
                    with open(path, "w", encoding="utf-8") as file:
                        file.write(new_content)
                    updated_footers += 1
                    print(f"Updated footer in {os.path.relpath(path, root_dir)}")
                    
    print(f"Total footers updated: {updated_footers}")
    
    # 2. Modify homepage (public/index.html) specifically
    homepage_path = os.path.join(root_dir, "index.html")
    with open(homepage_path, "r", encoding="utf-8") as file:
        home_content = file.read()
        
    # Revert FAQPage Schema
    schema_pattern = re.compile(r'<script type="application/ld\+json">\s*\{\s*"@context":\s*"https://schema.org",\s*"@graph":\s*\[.*?\n\s*\}\s*</script>', re.DOTALL)
    original_schema = '<script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@id":"https://silquetissues.com/#organization","@type":["Organization","LocalBusiness"],"name":"SILQUE","url":"https://silquetissues.com/","logo":"https://silquetissues.com/silque-logo-square.png","image":"https://silquetissues.com/silque-og-image.jpg","slogan":"Softness You Can Feel","email":"info@silquetissues.com","telephone":"+91-9122428064","description":"SILQUE is a Bengaluru-based airlaid napkin manufacturer and supplier for premium hospitality buyers, including hotels, restaurants, cafes, caterers, events, banquets, corporates, and distributors.","disambiguatingDescription":"SILQUE manufactures and supplies premium airlaid napkin formats in Bengaluru, Karnataka, India, with a focus on airlaid dinner napkins, cocktail napkins and pocket cutlery napkins for professional dining.","address":{"@type":"PostalAddress","streetAddress":"15, 3rd Cross, 80 Feet Road, Koramangala 6th Block","addressLocality":"Bengaluru","addressRegion":"Karnataka","postalCode":"560095","addressCountry":"IN"},"foundingLocation":{"@type":"City","name":"Bengaluru","alternateName":"Bangalore"},"areaServed":[{"@type":"City","name":"Bengaluru","alternateName":"Bangalore"},{"@type":"State","name":"Karnataka"},{"@type":"Country","name":"India"}],"sameAs":["https://www.instagram.com/silque_airlaidnapkins/","https://in.linkedin.com/company/silque","https://www.google.com/maps?cid=11710792032329002482","https://share.google/5GmHj8jMk6VzpAJfM"],"knowsAbout":["https://en.wikipedia.org/wiki/Air-laid_paper","https://en.wikipedia.org/wiki/Nonwoven_fabric","https://en.wikipedia.org/wiki/Napkin","https://www.wikidata.org/wiki/Q407005","https://www.wikidata.org/wiki/Q638703","https://www.wikidata.org/wiki/Q848532","airlaid napkins","hospitality table presentation","cocktail napkins","dinner napkins","pocket cutlery napkins"],"contactPoint":{"@type":"ContactPoint","contactType":"sales","telephone":"+91-9122428064","email":"info@silquetissues.com","availableLanguage":["English","Hindi"]},"hasMap":"https://www.google.com/maps?cid=11710792032329002482","location":{"@type":"Place","name":"SILQUE TISSUES Bengaluru Office","address":{"@type":"PostalAddress","streetAddress":"15, 3rd Cross, 80 Feet Road, Koramangala 6th Block","addressLocality":"Bengaluru","addressRegion":"Karnataka","postalCode":"560095","addressCountry":"IN"},"hasMap":"https://www.google.com/maps?cid=11710792032329002482","geo":{"@type":"GeoCoordinates","latitude":12.9395378,"longitude":77.6271298},"url":"https://silquetissues.com/contact"},"legalName":"SILQUE TISSUES","alternateName":["SILQUE TISSUES","SILQUE Tissues","Silque Tissues","SILQUE Airlaid Napkins"],"currenciesAccepted":"INR","paymentAccepted":"Bank transfer, UPI","priceRange":"Contact for bulk pricing","geo":{"@type":"GeoCoordinates","latitude":12.9395378,"longitude":77.6271298},"identifier":[{"@type":"PropertyValue","propertyID":"GSTIN","value":"29AFXFS1361J1Z8"}],"taxID":"29AFXFS1361J1Z8"},{"@id":"https://silquetissues.com/#website","@type":"WebSite","name":"SILQUE","url":"https://silquetissues.com/","publisher":{"@id":"https://silquetissues.com/#organization"},"inLanguage":"en-IN"},{"@id":"https://silquetissues.com/#homepage","@type":"WebPage","url":"https://silquetissues.com/","name":"Premium Airlaid Napkins Supplier in Bangalore | Silque","isPartOf":{"@id":"https://silquetissues.com/#website"},"about":{"@id":"https://silquetissues.com/#organization"},"mainEntity":{"@id":"https://silquetissues.com/#organization"},"primaryImageOfPage":{"@type":"ImageObject","url":"https://silquetissues.com/silque-og-image.jpg"},"description":"Silque supplies premium airlaid napkins for hotels, restaurants, clubs, caterers and events in Bangalore. Available in multiple sizes, GSM options and colors."}]}</script>'
    
    home_content = schema_pattern.sub(original_schema, home_content)
    
    # Revert FAQ block and toggle JavaScript in footer of homepage
    # Find the footer start and end
    footer_block_pattern = re.compile(r'  <footer class="site-footer">.*?</footer>\s*<script>.*?</script>', re.DOTALL)
    
    homepage_clean_footer = '<footer class="site-footer"><div class="container footer-grid"><div class="footer-brand"><img class="brand-logo" src="/silque-logo-square.png?v=20260519-ux-favicon" alt="SILQUE TISSUES corporate logo" width="320" height="320" loading="lazy" decoding="async"/><p>SILQUE airlaid napkins for premium hospitality.</p><p><a class="footer-map-link" href="https://www.google.com/maps?cid=11710792032329002482" target="_blank" rel="me noopener noreferrer">15, 3rd Cross, 80 Feet Road, Koramangala 6th Block, Bengaluru 560095.</a></p><p><a href="mailto:info@silquetissues.com">info@silquetissues.com</a></p><div class="footer-social"><a class="social-icon" href="https://www.instagram.com/silque_airlaidnapkins/" target="_blank" rel="me noopener noreferrer" aria-label="SILQUE on Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.5" cy="6.5" r="1.2"></circle></svg></a><a class="social-icon" href="https://in.linkedin.com/company/silque" target="_blank" rel="me noopener noreferrer" aria-label="SILQUE on LinkedIn"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 9.5V19"></path><path d="M6.5 6.5h.01"></path><path d="M11 19v-9.5"></path><path d="M11 13.4c0-2.2 1.4-4 3.7-4 2.1 0 3.3 1.4 3.3 4V19"></path></svg></a><a class="social-icon" href="https://www.google.com/maps?cid=11710792032329002482" target="_blank" rel="me noopener noreferrer" aria-label="SILQUE on Google Maps"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-5.1 7-11a7 7 0 0 0-14 0c0 5.9 7 11 7 11z"></path><circle cx="12" cy="10" r="2.5"></circle></svg></a></div></div><div class="footer-nav-compact"><details class="footer-group"><summary>Products</summary><ul><li><a href="/8x8-airlaid-cocktail-napkins">8x8 Cocktail Napkin</a></li><li><a href="/16x16-airlaid-dinner-napkins">16x16 Dinner Napkin</a></li><li><a href="/airlaid-pocket-napkins">Pocket Cutlery Napkin</a></li></ul></details><details class="footer-group"><summary>Company</summary><ul><li><a href="/about">About Us</a></li><li><a href="/contact">Contact Us</a></li><li><a href="/airlaid-napkins">What Is Airlaid</a></li><li><a href="/faq">FAQ</a></li></ul></details><details class="footer-group"><summary>Connect</summary><ul><li><a href="mailto:info@silquetissues.com">Email</a></li><li><a href="https://wa.me/919122428064" target="_blank" rel="noopener noreferrer">WhatsApp</a></li><li><a href="https://www.instagram.com/silque_airlaidnapkins/" target="_blank" rel="me noopener noreferrer">Instagram</a></li><li><a href="https://in.linkedin.com/company/silque" target="_blank" rel="me noopener noreferrer">LinkedIn</a></li><li><a href="https://www.google.com/maps?cid=11710792032329002482" target="_blank" rel="me noopener noreferrer">Google Business Maps</a></li></ul></details></div></div><div class="footer-bar"><div class="container">&copy; 2026 SILQUE | GSTIN: 29AFXFS1361J1Z8</div></div></footer>'
    
    home_content = footer_block_pattern.sub(homepage_clean_footer, home_content)
    
    # 3. Swap the homepage product card images
    cocktail_card_old = '''          <a class="home-product-card" href="/8x8-airlaid-cocktail-napkins" data-reveal>
            <img src="/silque-colour-sample-fan.webp" alt="SILQUE 8x8 cocktail airlaid napkins fan displaying color choices" width="1600" height="1067" loading="lazy" decoding="async" />
            <span>8x8 Cocktail Napkin</span>
            <p>For beverages, starters, cafes, counters, receptions, and event service.</p>
          </a>'''
          
    cocktail_card_new = '''          <a class="home-product-card" href="/8x8-airlaid-cocktail-napkins" data-reveal>
            <img src="/silque-colour-range-stacks.webp" alt="SILQUE 8x8 cocktail airlaid napkins stacked in navy, red, and charcoal" width="1400" height="934" loading="lazy" decoding="async" />
            <span>8x8 Cocktail Napkin</span>
            <p>For beverages, starters, cafes, counters, receptions, and event service.</p>
          </a>'''
          
    dinner_card_old = '''          <a class="home-product-card" href="/16x16-airlaid-dinner-napkins" data-reveal>
            <img src="/silque-colour-range-stacks.webp" alt="SILQUE 16x16 dinner airlaid paper napkins stacked in navy, red, and charcoal" width="1400" height="934" loading="lazy" decoding="async" />
            <span>16x16 Dinner Napkin</span>
            <p>For formal dining, hotel service, banquets, restaurants, and premium table settings.</p>
          </a>'''
          
    dinner_card_new = '''          <a class="home-product-card" href="/16x16-airlaid-dinner-napkins" data-reveal>
            <img src="/silque-colour-sample-fan.webp" alt="SILQUE 16x16 dinner airlaid napkins fan displaying color choices" width="1600" height="1067" loading="lazy" decoding="async" />
            <span>16x16 Dinner Napkin</span>
            <p>For formal dining, hotel service, banquets, restaurants, and premium table settings.</p>
          </a>'''
          
    home_content = home_content.replace(cocktail_card_old, cocktail_card_new)
    home_content = home_content.replace(dinner_card_old, dinner_card_new)
    
    with open(homepage_path, "w", encoding="utf-8") as file:
        file.write(home_content)
    print("Homepage (public/index.html) successfully modified!")
    
    # 4. Modify catalog page (public/products/index.html) specifically
    catalog_path = os.path.join(root_dir, "products", "index.html")
    if os.path.exists(catalog_path):
        with open(catalog_path, "r", encoding="utf-8") as file:
            cat_content = file.read()
            
        cocktail_cat_old = '<img src="/silque-colour-sample-fan.webp" alt="SILQUE 8x8 cocktail airlaid napkins fan displaying color choices" loading="eager" fetchpriority="high" width="1600" height="1067" decoding="async"/>'
        cocktail_cat_new = '<img src="/silque-colour-range-stacks.webp" alt="SILQUE 8x8 cocktail airlaid napkins stacked in navy, red, and charcoal" loading="eager" fetchpriority="high" width="1400" height="934" decoding="async"/>'
        
        dinner_cat_old = '<img src="/silque-colour-range-stacks.webp" alt="SILQUE 16x16 dinner airlaid paper napkins stacked in navy, red, and charcoal" loading="lazy" width="1400" height="934" decoding="async"/>'
        dinner_cat_new = '<img src="/silque-colour-sample-fan.webp" alt="SILQUE 16x16 dinner airlaid napkins fan displaying color choices" loading="lazy" width="1600" height="1067" decoding="async"/>'
        
        cat_content = cat_content.replace(cocktail_cat_old, cocktail_cat_new)
        cat_content = cat_content.replace(dinner_cat_old, dinner_cat_new)
        
        with open(catalog_path, "w", encoding="utf-8") as file:
            file.write(cat_content)
        print("Catalog page (public/products/index.html) successfully modified!")

if __name__ == "__main__":
    update_site()
