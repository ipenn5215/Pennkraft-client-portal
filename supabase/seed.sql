-- Seed data for Pennkraft database

-- Insert sample tools for the marketplace
INSERT INTO public.tools (name, slug, description, long_description, category, price, original_price, status, features, rating, reviews_count, downloads_count, badge, icon, color_scheme) VALUES
('PaintPro Estimator', 'paintpro-estimator', 'Advanced painting estimation tool with prevailing wage calculations', 'Complete painting estimation solution with material optimization, labor calculations, and prevailing wage support. Perfect for residential and commercial painting contractors.', 'estimating', 149.00, 199.00, 'active',
'["Prevailing wage calculations", "Material quantity optimizer", "Labor hour estimator", "Export to Excel/PDF", "Lifetime updates", "Multi-coat calculations", "Surface area calculator", "Paint coverage database"]'::jsonb,
4.8, 127, 1543, 'Best Seller', 'Calculator', 'from-blue-500 to-blue-600'),

('Tile & Floor Calculator Pro', 'tile-floor-calculator', 'Comprehensive tile and flooring takeoff tool', 'Professional-grade tile and flooring estimation tool with pattern layouts, waste calculations, and material optimization. Supports all tile sizes and patterns.', 'estimating', 99.00, 149.00, 'active',
'["Pattern layout optimizer", "Waste factor calculator", "Multiple room support", "Material database", "Cloud sync", "Grout calculator", "Adhesive estimator", "Cost breakdown reports"]'::jsonb,
4.9, 89, 987, 'Popular', 'FileSpreadsheet', 'from-purple-500 to-purple-600'),

('Drywall Master Suite', 'drywall-master', 'Complete drywall estimation suite', 'Comprehensive drywall estimation tool with support for all finishing levels, texture calculations, and fastener optimization. Industry-leading accuracy.', 'estimating', 129.00, NULL, 'active',
'["Level 0-5 finishing calculator", "Texture material estimator", "Fastener calculator", "Taping compound optimizer", "Project templates", "Moisture-resistant board calculator", "Fire-rated assembly support", "Soundproofing calculations"]'::jsonb,
4.7, 64, 756, NULL, 'Calculator', 'from-green-500 to-green-600'),

('Project Timeline Tracker', 'project-timeline', 'Visual project management with automated scheduling', 'Keep your construction projects on track with visual timelines, crew scheduling, and weather integration. Perfect for general contractors and project managers.', 'project-management', 199.00, 299.00, 'active',
'["Gantt chart visualization", "Crew scheduling", "Weather integration", "Progress tracking", "Client portal access", "Resource allocation", "Critical path analysis", "Mobile app sync"]'::jsonb,
4.6, 92, 1123, 'New', 'Clock', 'from-orange-500 to-orange-600'),

('Bid Analytics Dashboard', 'bid-analytics', 'Comprehensive bid analysis platform', 'Analyze your bidding performance, track win rates, and optimize your margins with data-driven insights. Essential for growing contractors.', 'analytics', 249.00, NULL, 'active',
'["Win rate analysis", "Competitor tracking", "Margin optimizer", "Historical data trends", "Custom reports", "Bid comparison tools", "Market analysis", "ROI calculator"]'::jsonb,
4.9, 41, 432, 'Pro', 'BarChart3', 'from-indigo-500 to-indigo-600'),

('Glass & Mirror Calculator', 'glass-mirror-calc', 'Specialized glass and mirror estimation', 'Tailored for glass contractors - calculate shower doors, mirrors, storefronts, and custom glass with precision. Includes hardware and installation time.', 'estimating', 89.00, 129.00, 'active',
'["Custom cut optimizer", "Hardware calculator", "Installation time estimator", "Safety glass requirements", "Quote generator", "Tempered glass calculator", "Edge work pricing", "Template library"]'::jsonb,
4.5, 37, 298, NULL, 'FileSpreadsheet', 'from-teal-500 to-teal-600'),

('Flooring Layout Designer', 'flooring-designer', 'Visual flooring layout and estimation tool', 'Design and estimate flooring projects with visual layout tools. Supports hardwood, laminate, vinyl, and carpet installations.', 'estimating', 179.00, NULL, 'active',
'["Visual room designer", "Direction optimizer", "Transition calculator", "Underlayment estimator", "Trim calculator", "Pattern matching", "Waste optimizer", "3D visualization"]'::jsonb,
4.7, 78, 892, 'Popular', 'Grid', 'from-rose-500 to-rose-600'),

('Construction Cost Database', 'cost-database', 'Comprehensive material and labor cost database', 'Always up-to-date construction cost database with regional pricing, labor rates, and material costs. Updated monthly.', 'analytics', 299.00, 399.00, 'active',
'["Regional pricing data", "Labor rate tables", "Material cost trends", "Prevailing wage data", "Historical pricing", "Cost indexing", "Supplier comparisons", "API access"]'::jsonb,
4.8, 156, 2341, 'Best Seller', 'Database', 'from-gray-600 to-gray-700'),

('Estimate Template Builder', 'template-builder', 'Create professional estimate templates', 'Build reusable estimate templates for common project types. Save time and ensure consistency across all your estimates.', 'estimating', 119.00, NULL, 'coming_soon',
'["Drag-drop builder", "Custom branding", "Variable pricing", "Conditional logic", "Multi-language support", "Client portal", "E-signature integration", "Payment processing"]'::jsonb,
0, 0, 0, 'Coming Soon', 'FileText', 'from-emerald-500 to-emerald-600'),

('Safety Compliance Tracker', 'safety-tracker', 'OSHA compliance and safety management', 'Track safety training, incidents, and OSHA compliance for your construction projects. Keep your workers safe and avoid costly violations.', 'project-management', 159.00, 199.00, 'active',
'["OSHA compliance checklists", "Training tracker", "Incident reporting", "Safety meeting logs", "Equipment inspections", "Hazard assessments", "Certificate management", "Mobile app"]'::jsonb,
4.6, 83, 671, NULL, 'Shield', 'from-red-500 to-red-600');

-- Insert sample contact submissions
INSERT INTO public.contact_submissions (name, email, phone, company, project_type, message, status) VALUES
('John Smith', 'john.smith@example.com', '555-0101', 'Smith Construction', 'Commercial Painting', 'Need a quote for a 50,000 sq ft warehouse painting project with prevailing wage requirements.', 'new'),
('Maria Garcia', 'maria@garciatile.com', '555-0102', 'Garcia Tile & Stone', 'Tile Installation', 'Looking for estimation services for high-end residential projects. We do 10-15 homes per month.', 'contacted'),
('Robert Johnson', 'rj@buildright.com', '555-0103', 'BuildRight Inc', 'Multiple', 'Interested in your AI estimation tools and custom software development services.', 'new'),
('Sarah Williams', 'sarah.w@gmail.com', '555-0104', NULL, 'Residential Drywall', 'Need help with drywall estimates for my new home construction business.', 'converted'),
('Michael Chen', 'mchen@glassworks.net', '555-0105', 'ChenGlass Solutions', 'Glass & Mirrors', 'Want to discuss custom estimation software for shower door and storefront projects.', 'new');

-- Note: Sample users and projects would typically be created through the application
-- after users sign up, so we're not seeding those tables here