-- Outlier Autowerke - MySQL schema
--
-- Column names are camelCase so rows returned by MySQL can be sent straight
-- to React as JSON with no renaming step in between.
--
-- Tables are dropped child first so the foreign keys do not block the drop.

DROP TABLE IF EXISTS offerMessages;
DROP TABLE IF EXISTS exchangeOffers;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS enquiries;
DROP TABLE IF EXISTS testimonials;
DROP TABLE IF EXISTS exchanges;
DROP TABLE IF EXISTS wanted;
DROP TABLE IF EXISTS listings;
DROP TABLE IF EXISTS projectWork;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS users;

-- ---------------------------------------------------------------------------
-- People
-- ---------------------------------------------------------------------------

-- Three roles, as confirmed by the client:
--   CUSTOMER - can browse, enquire, book a service, post a wanted ad, make a swap offer
--   STAFF    - all of the above plus manage listings, posts, enquiries and bookings
--   ADMIN    - all of the above plus manage services, projects and staff accounts
CREATE TABLE users (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(100) NOT NULL,
  email        VARCHAR(150) NOT NULL UNIQUE,
  passwordHash VARCHAR(255) NOT NULL,
  phone        VARCHAR(40)  NOT NULL DEFAULT '',
  suburb       VARCHAR(100) NOT NULL DEFAULT '',
  role         VARCHAR(20)  NOT NULL DEFAULT 'CUSTOMER',
  -- When the person agreed to the privacy policy. Required before we store
  -- anything about them.
  consentAt    DATETIME     NULL,
  createdAt    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------------
-- Website content, managed by an administrator
-- ---------------------------------------------------------------------------

CREATE TABLE services (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  title     VARCHAR(150) NOT NULL,
  summary   VARCHAR(300) NOT NULL,
  detail    TEXT         NOT NULL,
  price     VARCHAR(60)  NOT NULL,
  -- Whether customers can book this one online.
  bookable  TINYINT(1)   NOT NULL DEFAULT 1,
  sortOrder INT          NOT NULL DEFAULT 0
);

CREATE TABLE projects (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  slug     VARCHAR(120) NOT NULL UNIQUE,
  title    VARCHAR(150) NOT NULL,
  make     VARCHAR(60)  NOT NULL,
  category VARCHAR(60)  NOT NULL,
  `year`   INT          NOT NULL,
  duration VARCHAR(60)  NOT NULL,
  summary  VARCHAR(400) NOT NULL,
  story    TEXT         NOT NULL,
  result   VARCHAR(400) NOT NULL,
  featured TINYINT(1)   NOT NULL DEFAULT 0
);

-- One row per bullet point on a project page. A separate table rather than a
-- comma separated column, because one project has many work items.
CREATE TABLE projectWork (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  projectId   INT NOT NULL,
  description VARCHAR(300) NOT NULL,
  FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------------
-- Marketplace. Only staff and administrators create listings.
-- ---------------------------------------------------------------------------

CREATE TABLE listings (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  title         VARCHAR(200) NOT NULL,
  category      VARCHAR(60)  NOT NULL,
  make          VARCHAR(60)  NOT NULL,
  fitment       VARCHAR(200) NOT NULL,
  partNumber    VARCHAR(80)  NOT NULL,
  itemCondition VARCHAR(40)  NOT NULL,
  price         DECIMAL(10,2) NOT NULL,
  quantity      INT          NOT NULL DEFAULT 1,
  status        VARCHAR(20)  NOT NULL DEFAULT 'available',
  description   TEXT         NOT NULL,
  createdAt     DATE         NOT NULL,
  INDEX idxCategory (category),
  INDEX idxMake (make),
  INDEX idxStatus (status)
);

-- ---------------------------------------------------------------------------
-- Parts wanted. Customers may post; staff approve before it appears publicly.
-- ---------------------------------------------------------------------------

CREATE TABLE wanted (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(200) NOT NULL,
  make        VARCHAR(60)  NOT NULL DEFAULT '',
  postedBy    VARCHAR(100) NOT NULL,
  userId      INT          NULL,
  isStaff     TINYINT(1)   NOT NULL DEFAULT 0,
  contact     VARCHAR(150) NOT NULL,
  budget      VARCHAR(80)  NOT NULL DEFAULT '',
  description TEXT         NOT NULL,
  status      VARCHAR(20)  NOT NULL DEFAULT 'open',
  approved    TINYINT(1)   NOT NULL DEFAULT 0,
  createdAt   DATE         NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
);

-- ---------------------------------------------------------------------------
-- Parts exchange. Autowerke lists an item it will swap; a signed in customer
-- offers a specific part in return, and the two sides negotiate in a thread.
-- ---------------------------------------------------------------------------

CREATE TABLE exchanges (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(200) NOT NULL,
  make        VARCHAR(60)  NOT NULL DEFAULT '',
  offering    VARCHAR(400) NOT NULL,
  wanting     VARCHAR(400) NOT NULL,
  description TEXT         NOT NULL,
  status      VARCHAR(20)  NOT NULL DEFAULT 'open',
  createdAt   DATE         NOT NULL
);

-- A specific swap proposed against one exchange item.
CREATE TABLE exchangeOffers (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  exchangeId     INT NOT NULL,
  userId         INT NOT NULL,
  offering       VARCHAR(400) NOT NULL,
  -- Positive means the offerer adds cash, negative means they want cash back.
  cashAdjustment DECIMAL(10,2) NOT NULL DEFAULT 0,
  status         VARCHAR(20)  NOT NULL DEFAULT 'pending',
  createdAt      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (exchangeId) REFERENCES exchanges(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- The back and forth negotiation on one offer.
CREATE TABLE offerMessages (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  offerId   INT NOT NULL,
  userId    INT NOT NULL,
  body      TEXT NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (offerId) REFERENCES exchangeOffers(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------------
-- Reviews, enquiries and service bookings
-- ---------------------------------------------------------------------------

CREATE TABLE testimonials (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  name      VARCHAR(100) NOT NULL,
  vehicle   VARCHAR(120) NOT NULL,
  rating    INT          NOT NULL DEFAULT 5,
  quote     TEXT         NOT NULL,
  approved  TINYINT(1)   NOT NULL DEFAULT 0,
  createdAt DATE         NOT NULL
);

CREATE TABLE enquiries (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  type      VARCHAR(30)  NOT NULL DEFAULT 'General',
  name      VARCHAR(100) NOT NULL,
  email     VARCHAR(150) NOT NULL,
  phone     VARCHAR(40)  NOT NULL DEFAULT '',
  vehicle   VARCHAR(120) NOT NULL DEFAULT '',
  subject   VARCHAR(200) NOT NULL,
  message   TEXT         NOT NULL,
  -- Filename of the optional photo, stored in server/uploads.
  photo     VARCHAR(200) NULL,
  listingId INT          NULL,
  userId    INT          NULL,
  status    VARCHAR(20)  NOT NULL DEFAULT 'new',
  consentAt DATETIME     NULL,
  createdAt DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (listingId) REFERENCES listings(id) ON DELETE SET NULL,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
);

-- Anyone can book a service, signed in or not.
CREATE TABLE bookings (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  serviceId     INT          NOT NULL,
  userId        INT          NULL,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(150) NOT NULL,
  phone         VARCHAR(40)  NOT NULL DEFAULT '',
  vehicle       VARCHAR(120) NOT NULL,
  preferredDate DATE         NOT NULL,
  notes         TEXT         NOT NULL,
  status        VARCHAR(20)  NOT NULL DEFAULT 'requested',
  consentAt     DATETIME     NULL,
  createdAt     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (serviceId) REFERENCES services(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
);
