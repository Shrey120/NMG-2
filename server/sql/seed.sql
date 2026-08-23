-- Sample data for the prototype.
-- Everything here is invented for demonstration and gets replaced
-- once the client supplies real services, photos, parts and reviews.

INSERT INTO services (title, summary, detail, price, bookable, sortOrder) VALUES
('Performance Tuning', 'Dyno-backed calibration for European engines, naturally aspirated or turbocharged.', 'Custom maps developed on the dyno rather than off-the-shelf flashes. Covers stage 1 through to fully built engines, including boost control, fuelling and safety limits tuned for Australian fuel and climate.', 'From $890', 1, 1),
('Engine Building', 'Full rebuilds, from a routine refresh to high compression race specification.', 'Complete teardown, measurement and reassembly with documented clearances. Forged internals, head work, balancing and dyno run-in available. Every build is photographed and handed over with a written specification sheet.', 'Quoted per build', 1, 2),
('Restoration', 'Sympathetic restorations and modernised resto-mod builds for 80s and 90s European cars.', 'Rust repair, panel and paint coordination, interior retrim and mechanical overhaul. We work to an agreed scope and photograph every stage so you can see exactly where the budget went.', 'Quoted per project', 1, 3),
('Diagnostics and Servicing', 'Logbook servicing and fault finding with manufacturer level scan tools.', 'Routine servicing that protects your warranty, plus deep diagnostic work on electrical faults, running problems and intermittent issues that generic scanners cannot see.', 'From $220', 1, 4),
('Custom Fabrication', 'One-off intakes, exhausts, mounts and roll cages made in house.', 'TIG welded stainless and alloy fabrication for parts that do not exist off the shelf. Roll cages, turbo manifolds, intercooler piping, subframe reinforcement and custom mounting solutions.', 'From $450', 1, 5),
('Parts Sourcing', 'Hard to find OEM, NOS and performance parts sourced through a global network.', 'Years of contacts across Europe, Japan and the US mean we can usually find the part that everyone else says is discontinued. We also carry rotating stock, listed in the marketplace.', 'Fee from $95', 1, 6);

INSERT INTO projects (slug, title, make, category, `year`, duration, summary, story, result, featured) VALUES
('bmw-e30-track-build', 'BMW E30 325i Track Build', 'BMW', 'Track Build', 2024, '14 weeks', 'A tired road going E30 turned into a reliable club day car without losing its street manners.', 'The car arrived with 280,000km, a soft chassis and brakes that faded after two laps. We seam welded key areas, fitted a bolt-in half cage, rebuilt the engine with a mild cam and rebalanced rotating assembly, then dialled in coilovers and a big brake kit.', '187kW at the flywheel, 42kg lighter, and consistent lap times with no brake fade.', 1),
('porsche-944-restoration', 'Porsche 944 Turbo Restoration', 'Porsche', 'Restoration', 2024, '11 months', 'A barn find brought back to a standard arguably better than it left the factory.', 'Twenty years off the road had left the car with widespread surface rust and a seized engine. Every panel came off, the shell was media blasted and epoxy primed, and the driveline was rebuilt from the crank up.', 'Concours presentable and genuinely usable. It gets driven to shows rather than trailered.', 1),
('audi-s3-stage-2', 'Audi S3 Stage 2 Package', 'Audi', 'Performance', 2025, '3 weeks', 'A daily driver that needed more urgency without becoming unbearable in traffic.', 'The owner wanted real world pace and reliability, not a headline dyno number. We fitted supporting hardware first, then developed the calibration across several heat soak cycles to be sure the numbers held up on a hot day.', '272kW at the wheels, still returning 8.1L per 100km on the commute.', 1),
('vw-golf-mk2-resto-mod', 'VW Golf Mk2 Resto-Mod', 'Volkswagen', 'Resto-Mod', 2023, '8 months', 'Classic looks with an entirely modern driveline underneath.', 'A clean shell was mated to a 1.8T driveline with modern engine management, uprated brakes and a fully sound deadened interior. The brief was that it should look almost stock from ten paces and be usable every day.', '198kW, air conditioning that works, and it still passes for stock in a car park.', 0),
('bmw-e46-m3-rebuild', 'BMW E46 M3 Engine Rebuild', 'BMW', 'Engine Build', 2025, '6 weeks', 'A preventative bearing service that became a full refresh once we opened it up.', 'The customer booked in for the well known rod bearing job. Measurement showed wear beyond specification on two journals, so with approval we went further with new bearings throughout and a full gasket set.', 'Clean oil analysis at 1,000km and a documented service history for resale.', 0),
('mercedes-190e-refresh', 'Mercedes 190E Mechanical Refresh', 'Mercedes-Benz', 'Restoration', 2024, '9 weeks', 'Sorting forty years of accumulated small faults on a Cosworth headed icon.', 'Nothing was catastrophically wrong, but everything was slightly tired. We worked through the whole car methodically, from suspension bushings to the fuel system and a careful recommissioning of the 16 valve head.', 'Drives the way the road tests described it in 1986.', 0);

INSERT INTO projectWork (projectId, description) VALUES
(1, 'Engine rebuild with mild cam and balanced rotating assembly'),
(1, 'Bolt-in half cage and seam welding'),
(1, 'Coilover suspension with corner balancing'),
(1, 'Big brake upgrade with braided lines'),
(2, 'Shell media blasted, epoxy primed and resprayed'),
(2, 'Complete engine and turbo rebuild'),
(2, 'Transaxle rebuild and new clutch'),
(2, 'Full interior retrim in period correct materials'),
(3, 'High flow intake and turbo-back exhaust'),
(3, 'Uprated intercooler and charge pipes'),
(3, 'Custom calibration developed over four dyno sessions'),
(3, 'Transmission tune to suit'),
(4, 'Engine conversion with standalone management'),
(4, 'Custom wiring loom built from scratch'),
(4, 'Uprated brakes and suspension geometry correction'),
(5, 'Rod and main bearing replacement with measured clearances'),
(5, 'Variable valve timing unit rebuild'),
(5, 'Complete gasket and seal refresh'),
(6, 'Full suspension bush and damper replacement'),
(6, 'Fuel system recommissioning'),
(6, 'Cylinder head service and valve adjustment');

INSERT INTO listings (title, category, make, fitment, partNumber, itemCondition, price, quantity, status, description, createdAt) VALUES
('Brembo 4-Pot Big Brake Kit', 'Brakes', 'BMW', 'E36 and E46 non-M, 1992 to 2006', 'BRE-4P-E46', 'Used - Excellent', 1450.00, 1, 'available', 'Complete front big brake kit removed from a track car at the end of last season. Includes calipers, 325mm two piece rotors, brackets and braided lines. Pads have roughly 60 percent life remaining.', '2026-07-28'),
('Garrett GT2871R Turbocharger', 'Forced Induction', 'Universal', 'T25 flange, universal application', 'GAR-836026', 'Used - Good', 1150.00, 1, 'available', 'Genuine Garrett unit, not a copy. Recently cleaned and inspected with no shaft play and undamaged blades. Suits 250 to 350kW applications. Turbine housing sold separately.', '2026-07-25'),
('KW Variant 3 Coilover Kit', 'Suspension', 'Audi', 'A3 and S3 8V, 2013 to 2020', 'KW-35210084', 'Used - Excellent', 2100.00, 1, 'available', 'Around 12,000km of road use only, never tracked. Independently adjustable compression and rebound. All adjusters free and moving, no weeping seals, threads clean. Original spanners included.', '2026-07-22'),
('BBS RS 17x8 Wheel Set', 'Wheels and Tyres', 'Volkswagen', '5x112 PCD, ET35', 'BBS-RS-178', 'Refurbished', 3400.00, 4, 'available', 'Genuine three piece set, fully rebuilt with new hardware and freshly polished lips. No kerb damage and no buckles, all four run true. Tyres not included.', '2026-07-19'),
('Recaro Pole Position Seat Pair', 'Interior', 'Universal', 'Universal, side mount rails required', 'REC-PP-2', 'Used - Good', 2650.00, 2, 'available', 'Matching pair in black leather. Light bolster wear on the driver side consistent with age, no tears or splits. Certification has expired so these are road use only. Rails not included.', '2026-07-15'),
('Titanium Slip-On Exhaust', 'Exhaust', 'Porsche', 'Cayman and Boxster 981, 2012 to 2016', 'AKR-981SO', 'Used - Excellent', 3900.00, 1, 'available', 'Titanium slip-on system with carbon tips. Removed at 9,000km when the car was sold. No dents and no discolouration beyond the usual titanium bluing. Original carton and hardware included.', '2026-07-12'),
('Competition Intercooler Kit', 'Cooling', 'Volkswagen', 'Golf Mk7 GTI and R, 2013 to 2020', 'WAG-200001', 'New', 1290.00, 2, 'available', 'Brand new and still boxed. Bar and plate core with cast end tanks. Direct bolt-in replacement with no trimming required. Significant reduction in intake temperatures on repeated pulls.', '2026-07-08'),
('Quaife Limited Slip Differential', 'Drivetrain', 'Volkswagen', '02J five speed gearbox', 'QDF-8J', 'New', 1850.00, 1, 'available', 'Helical torque biasing differential, brand new and unfitted. Transforms front wheel drive traction out of corners without the noise or maintenance of a plate type unit.', '2026-07-04'),
('Euro Ellipsoid Headlight Set', 'Lighting', 'BMW', 'E30, 1982 to 1994', 'BMW-E30-EU', 'Used - Good', 780.00, 1, 'available', 'Genuine set, increasingly hard to find in this condition. Lenses are clear with no fogging or cracks and the chrome rings are present and straight. Minor pitting to one reflector.', '2026-06-30'),
('MOMO Prototipo Steering Wheel', 'Interior', 'Universal', 'Universal, boss kit required', 'MOM-PRO35', 'Used - Excellent', 420.00, 1, 'sold', 'Genuine MOMO, 350mm, black leather with black spokes. Leather is supple with no wear through. Horn button included. Boss kit not included but we can source one.', '2026-06-26'),
('Sachs Performance Clutch Kit', 'Drivetrain', 'Audi', '1.8T and 2.0T transverse', 'SAC-883082', 'New', 1690.00, 1, 'reserved', 'Uprated organic clutch rated to approximately 450Nm, supplied with a lightweight single mass flywheel. Retains civilised road manners with no chatter. Release bearing and alignment tool included.', '2026-06-21'),
('Custom Stainless Turbo Manifold', 'Forced Induction', 'BMW', 'M20 engine, T3 flange', 'OA-FAB-M20', 'New', 1250.00, 1, 'available', 'Made in house from 321 stainless with back purged welds and a 10mm laser cut head flange. T3 turbine flange with provision for a 44mm external wastegate. Jig built for repeatability.', '2026-06-05');

INSERT INTO wanted (title, make, postedBy, userId, isStaff, contact, budget, description, status, approved, createdAt) VALUES
('BMW E30 M-Technic II Front Bumper', 'BMW', 'Outlier Autowerke', 1, 1, 'hello@outlierautowerke.example', 'Up to $1,200', 'Chasing a genuine M-Tech II front bumper for a customer build. Original preferred but a good quality reproduction will be considered. Cracks and tabs are fine, we can repair. Happy to arrange freight.', 'open', 1, '2026-08-02'),
('Porsche 944 Turbo Front Calipers', 'Porsche', 'Daniel R.', 3, 0, 'Via site enquiry', '$800 to $1,500', 'Looking for a pair of front calipers from a 951 Turbo S. Seized is fine as long as the bodies are not cracked or heavily corroded, as I can rebuild them myself.', 'open', 1, '2026-07-29'),
('15 inch Steel Wheels for Rally Use', 'Volkswagen', 'Marcus L.', 4, 0, 'Via site enquiry', 'Up to $400 the set', 'After a set of four, ideally six, 15 inch steel wheels in 5x100 for a gravel car. Rust and ugly paint are not an issue but they need to be straight and not buckled.', 'open', 1, '2026-07-24'),
('Individual Throttle Body Assembly', 'BMW', 'Outlier Autowerke', 1, 1, 'hello@outlierautowerke.example', 'Market rate', 'Need a complete throttle body assembly including the actuator for a customer conversion. Would also consider a full engine if the price is right and the rest is serviceable.', 'fulfilled', 1, '2026-07-16'),
('Mk1 Golf GTI Interior, Any Condition', 'Volkswagen', 'Daniel R.', 3, 0, 'Via site enquiry', 'Negotiable', 'Chasing a complete Mk1 interior - seats, door cards, rear bench. Faded and torn is fine, I have a trimmer lined up. This row is left unapproved so the moderation queue has something in it.', 'open', 0, '2026-08-18');

INSERT INTO exchanges (title, make, offering, wanting, description, status, createdAt) VALUES
('OBD1 ECU, swap for OBD2', 'BMW', 'OBD1 engine control unit, tested and working, removed from a running car', 'Equivalent OBD2 unit, or a set of E36 M3 front control arms', 'Ended up with the wrong variant after an engine swap. Straight swap preferred, happy to settle a difference in cash either way depending on condition.', 'open', '2026-08-05'),
('Turbo manifold, swap for intercooler', 'Volkswagen', 'Cast 1.8T turbo manifold, crack tested and clean', 'Front mount intercooler kit suitable for a Mk4 platform', 'Surplus to requirements after a customer changed direction mid build. Would consider other forced induction hardware of similar value.', 'open', '2026-07-20'),
('17 inch wheels, trade for 18 inch', 'Audi', 'Genuine 17x7.5 5x112 wheels, four of them, no damage, tyres at 60 percent', 'Genuine 18 inch in the same pattern, any style considered', 'These came off a customer car on a wheel upgrade. Straight and true with no kerb rash worth mentioning.', 'open', '2026-07-31');

-- A customer offer against the first exchange item, with the negotiation so far.
INSERT INTO exchangeOffers (exchangeId, userId, offering, cashAdjustment, status, createdAt) VALUES
(1, 3, 'Set of four E36 M3 front control arms, new in box, plus a spare OBD2 loom', 0.00, 'pending', '2026-08-19 09:15:00'),
(2, 4, 'Forge front mount intercooler kit off a Mk4 Golf, complete with piping', -150.00, 'pending', '2026-08-20 14:02:00');

INSERT INTO offerMessages (offerId, userId, body, createdAt) VALUES
(1, 3, 'Are the control arms enough on their own, or do you want the loom included as well? Happy either way.', '2026-08-19 09:15:00'),
(1, 1, 'Control arms alone would do it if they are genuine. Can you send a photo of the boxes?', '2026-08-19 16:40:00'),
(1, 3, 'They are genuine, still sealed. I will get photos across tonight.', '2026-08-20 08:05:00'),
(2, 4, 'Kit is complete but the piping has a scuff on one bend. Hence asking for a bit back.', '2026-08-20 14:02:00');

INSERT INTO testimonials (name, vehicle, rating, quote, approved, createdAt) VALUES
('Daniel R.', 'BMW E30 325i', 5, 'I had been to three workshops before this one and nobody could sort the running issue. It was diagnosed in an afternoon and explained to me in plain English. The track build that followed was documented every step of the way.', 1, '2026-06-14'),
('Priya M.', 'Audi S3', 5, 'What I appreciated most was the honesty. I asked for a bigger turbo and was talked out of it, because for how I actually drive the car it would have been a waste of money. I spent less and enjoy the car more.', 1, '2026-05-30'),
('Marcus L.', 'Porsche 944 Turbo', 5, 'An eleven month restoration and I got photos every single week. No surprises on the final invoice, and the car is genuinely better than I hoped. It gets driven, which was always the point.', 1, '2026-04-22'),
('Steph K.', 'VW Golf Mk2', 4, 'The build took longer than originally quoted, which was frustrating at the time, but the reasons were explained and the quality is undeniable. I would go back without hesitation.', 1, '2026-03-18'),
('Tom H.', 'BMW E46 M3', 5, 'Booked in for bearings and got a call partway through explaining that two journals were out of specification, with photos and measurements attached. I approved the extra work on the spot because the evidence was right there.', 1, '2026-02-09'),
('Jordan W.', 'Mercedes 190E', 5, 'Submitted through the website and waiting on approval. This row exists so the moderation queue in the admin panel has something in it to demonstrate.', 0, '2026-08-11');

INSERT INTO enquiries (type, name, email, phone, vehicle, subject, message, listingId, status) VALUES
('Parts', 'Jordan Whitfield', 'jordan.w@example.com', '0400 000 111', '2015 Audi S3', 'Coilovers still available?', 'Hi, is the KW Variant 3 kit still available? I am in Brisbane and could collect this weekend. Would you take $1,950 cash?', 3, 'new'),
('Service', 'Amelia Chen', 'amelia.chen@example.com', '0400 000 222', '2003 BMW E46 M3', 'Rod bearing service quote', 'Looking to book in a preventative rod bearing job. The car has 142,000km and a full service history. What is the current lead time and roughly what should I budget?', NULL, 'new'),
('Collaboration', 'Reece Anderson', 'reece@example.com', '0400 000 333', '', 'Fabrication partnership', 'We run a small motorsport prep shop and are looking for a fabrication partner for manifold and cage work. Would you be open to a conversation about taking on overflow work?', NULL, 'read'),
('General', 'Sophie Nguyen', 'sophie.n@example.com', '0400 000 444', '1991 Porsche 944', 'Pre-purchase inspection', 'I am looking at a 944 for sale nearby and would like a pre-purchase inspection before committing. Do you offer this and what does it cost?', NULL, 'read'),
('Parts', 'Hamish Doyle', 'hamish.d@example.com', '0400 000 555', '1988 BMW E30', 'Freight to Perth?', 'Interested in the headlight set. Can you pack and freight to Perth, and if so what would that cost on top?', 9, 'replied');

INSERT INTO bookings (serviceId, userId, name, email, phone, vehicle, preferredDate, notes, status) VALUES
(4, 3, 'Daniel Reeve', 'daniel.r@example.com', '0400 000 777', '1989 BMW E30 325i', '2026-09-02', 'Due for a logbook service. There is also a slight misfire under load I would like looked at.', 'requested'),
(1, NULL, 'Nadia Kaur', 'nadia.k@example.com', '0400 000 888', '2018 VW Golf R', '2026-09-05', 'After a stage 1 tune. Car is otherwise standard.', 'requested'),
(2, 4, 'Marcus Lowe', 'marcus.l@example.com', '0400 000 999', '2003 BMW E46 M3', '2026-09-12', 'Preventative rod bearing job, discussed by email already.', 'confirmed');
