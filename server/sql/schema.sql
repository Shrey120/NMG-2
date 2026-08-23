-- Outlier Autowerke - MySQL schema
-- Column names are camelCase so rows returned by MySQL can be sent
-- straight to React as JSON with no renaming step in between.

DROP TABLE IF EXISTS enquiries;
DROP TABLE IF EXISTS testimonials;
DROP TABLE IF EXISTS exchanges;
DROP TABLE IF EXISTS wanted;
DROP TABLE IF EXISTS listings;
DROP TABLE IF EXISTS projectWork;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS users;

-- Staff accounts for the admin panel.
CREATE TABLE users (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(100) NOT NULL,
  email        VARCHAR(150) NOT NULL UNIQUE,
  passwordHash VARCHAR(255) NOT NULL,
  role         VARCHAR(20)  NOT NULL DEFAULT 'ADMIN',
  createdAt    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE services (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  title    VARCHAR(150) NOT NULL,
  summary  VARCHAR(300) NOT NULL,
  detail   TEXT         NOT NULL,
  price    VARCHAR(60)  NOT NULL,
  sortOrder INT         NOT NULL DEFAULT 0
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

-- One row per bullet point on a project page.
-- A separate table rather than a comma separated column, because
-- "one project has many work items" is a real one-to-many relationship.
CREATE TABLE projectWork (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  projectId   INT NOT NULL,
  description VARCHAR(300) NOT NULL,
  FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE
);

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

CREATE TABLE wanted (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(200) NOT NULL,
  make        VARCHAR(60)  NOT NULL DEFAULT '',
  postedBy    VARCHAR(100) NOT NULL,
  isStaff     TINYINT(1)   NOT NULL DEFAULT 0,
  contact     VARCHAR(150) NOT NULL,
  budget      VARCHAR(80)  NOT NULL DEFAULT '',
  description TEXT         NOT NULL,
  status      VARCHAR(20)  NOT NULL DEFAULT 'open',
  createdAt   DATE         NOT NULL
);

CREATE TABLE exchanges (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(200) NOT NULL,
  make        VARCHAR(60)  NOT NULL DEFAULT '',
  postedBy    VARCHAR(100) NOT NULL,
  isStaff     TINYINT(1)   NOT NULL DEFAULT 0,
  contact     VARCHAR(150) NOT NULL,
  offering    VARCHAR(400) NOT NULL,
  wanting     VARCHAR(400) NOT NULL,
  description TEXT         NOT NULL,
  status      VARCHAR(20)  NOT NULL DEFAULT 'open',
  createdAt   DATE         NOT NULL
);

CREATE TABLE testimonials (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  name     VARCHAR(100) NOT NULL,
  vehicle  VARCHAR(120) NOT NULL,
  rating   INT          NOT NULL DEFAULT 5,
  quote    TEXT         NOT NULL,
  approved TINYINT(1)   NOT NULL DEFAULT 0,
  createdAt DATE        NOT NULL
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
  listingId INT          NULL,
  status    VARCHAR(20)  NOT NULL DEFAULT 'new',
  createdAt DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (listingId) REFERENCES listings(id) ON DELETE SET NULL
);
