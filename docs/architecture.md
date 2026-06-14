# NEXTLOCK Architecture

## Project Overview

NEXTLOCK is a category-based password manager.

Users can:

* Create categories
* Store accounts inside categories
* Save usernames and passwords
* Update passwords
* Track update date and time

Data is stored using Markdown (.md) files.

---

## System Flow

User

↓

UI Layer

↓

Logic Layer

↓

Storage Layer

↓

Markdown Files

---

## Layers

### 1. UI Layer

Location:

```text
src/ui/
```

Responsible for:

* Displaying pages
* Buttons
* Forms
* User interactions

Files:

* index.html
* category.html
* account.html
* styles.css
* app.js

Owner:

Enki

---

### 2. Logic Layer

Location:

```text
src/categories/
src/accounts/
```

Responsible for:

* Creating categories
* Managing accounts
* Updating passwords
* Processing user actions

Files:

* categoryManager.js
* accountManager.js

Owner:

GK

---

### 3. Storage Layer

Location:

```text
src/storage/
```

Responsible for:

* Reading markdown files
* Writing markdown files
* Updating markdown files

Files:

* fileManager.js
* markdownManager.js

Owner:

GK

---

### 4. Security Layer

Location:

```text
src/security/
```

Responsible for:

* Future encryption
* Future password protection

Files:

* encryption.js

Owner:

GK

---

## Data Structure

Category Example:

Gmail

↓

Accounts

* Account 1
* Account 2
* Account 3

Each account contains:

* Username
* Password
* Updated Date
* Updated Time

---

## Storage Structure

data/

* Gmail.md
* Facebook.md
* Snapchat.md

Each category has its own markdown file.

---

## Team Responsibilities

### GK

* Project architecture
* Logic development
* Data storage
* Integration
* GitHub management

### Enki

* UI design
* Frontend development
* User experience
* Styling

---

## Future Improvements

* Search accounts
* Password history
* Encryption
* Dark mode
* Export and import data

---

## Development Strategy

Phase 1

* Documentation

Phase 2

* UI Development

Phase 3

* Logic Development

Phase 4

* Storage Integration

Phase 5

* Testing

Phase 6

* Final Improvements
