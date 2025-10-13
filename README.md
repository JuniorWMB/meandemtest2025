# 🧪 Web Analytics Implementation Engineer - Technical Test

Welcome! This technical test is designed to evaluate your ability to implement frontend analytics instrumentation in an e-commerce application and integrate with external analytics platforms in a performant and privacy-conscious way.

---

## 📜 Submission Guide

1. **Do not fork this repository.**
   Instead, click the link below to create your own copy using this template:

   👉 [Use this template](https://github.com/meandem-tech/meandem-fsae-tech-test/generate)

2. Read the README in its entirety

3. Complete the test in your newly created repo

4. **Send a the link** to your completed repository once you're done.

### 🤔 Things to keep in mind

- Keep commits clean and readable.
- If you encounter issues or ambiguities, mention them in a README or as comments.
- Please do not modify the [mock-server](./mock-server) code unless explicitly instructed.

---

## 🧩 Overview

Your task is to implement analytics tracking for a simplified e-commerce application built in **Next.js**, which currently has no tracking or analytics integrations.

There are three main events we are interested in tracking:

- Page views
- Add to cart actions
- Checkout success

You’ll simulate integrations with tools like **Google Analytics**, **Algolia**, and **Ometria**, using a set of **dummy API endpoints**, which are hosted on a [mock server](#--analytics-mock-server).

A [cookie banner](#-cookie-banner) exists on the site, using which the user can accept or decline cookies.

A basic [analytics API route](./src/app/api/analytics/route.ts) has been configured, which should be used to send requests to a `/collect/secure` endpoint on the mock server, which emulates a server side analytics container.

## ✅ Assessment

Complete each of the tasks below, with the following general requirements in mind:

- Only send analytics events if the user has given consent
- Hash PII (e.g., email) before sending it any endpoint
- Structure your analytics events in a consistent, reusable format
- Ensure event tracking is non-blocking and doesn’t degrade user experience
- Write tests for the event tracking code that you implement (we're not looking for full coverage, but rather an idea of how you write and structure unit tests).

Aim to spend 2-3 hours on this assessment. Try to get as far as you can in the time as possible, don't worry if you don't have time to complete all the tasks, we're more interested in your approach.

The core e-commerce functionality (cart, checkout, product pages, etc.) is already implemented for you. You do not need to build the shopping experience from scratch. Focus on adding analytics requests and instrumentation as described below

Feel free to leave a markdown file of improvements you would have made had you had more time / what your approach to unattempted tasks would have been.

### Task 1

Given the user adds an item to cart, a successful `add_to_cart` analytics request should be sent to the `/collect/gtm` endpoint on the analytics mock server.

### Task 2

Given the user successfully checks out, a successful `checkout_success` analytics request should be sent via the NextJS API route `/api/analytics` to the backend `/collect/secure` endpoint on the analytics mock server.

### Task 3

Given the user adds an item to the cart, a successful `add_to_cart` analytics request should be sent to all four analytics endpoints, including the `/collect/secure` endpoint

### Task 4

Loading any page should send the `page_view` with the appropriate consent to each of the four analytics endpoints. This should be true even when landing on the site for the first time.

---

## 🏁 Getting Started

> **Suggested Node.js Version:**
>
> The recommended Node.js version for this project can be found in the [.nvmrc](./.nvmrc) file. If you use [nvm](https://github.com/nvm-sh/nvm), you can run `nvm use` in the project directory to automatically switch to the correct version.

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Run the analytics mock-server**

   ```bash
   pnpm run mock-server
   ```

3. **Start the e-commerce app** (in a separate terminal)

   ```bash
   pnpm run dev
   ```

## 🛒 E-commerce Application

The e-commerce application is built with Next.js and runs on port **3000** by default.

Once started, you can access it at:

```text
http://localhost:3000
```

---

## 📡  Analytics Mock Server

### Analytics Endpoints Accessible From the Frontend

The mock server runs on a **separate port** (default: `http://localhost:4000`) and exposes the following endpoints:

| Endpoint              | Description                          |
|-----------------------|--------------------------------------|
| `POST http://localhost:4000/collect/gtm`     | Simulates Google Analytics client-side |
| `POST http://localhost:4000/collect/algolia`| Simulates tracking for Algolia insights API  |
| `POST http://localhost:4000/collect/ometria`| Simulates Ometria tracking            |

### Analytics Endpoints Accessible From the Backend

One endpoint is only accessible from the **backend only**, simulating server-side tagging:

| Endpoint                | Description                           |
|-------------------------|---------------------------------------|
| `POST http://localhost:4000/collect/secure`   | Must only be called from the backend (e.g., server API route)|

This endpoint must be called with the following header

`Authorization: supersecretkey`

### Reporting Endpoint

Use this report to verify your tracking implementation and consent logic. Refresh the page to see live updates as events are sent.

| Endpoint                | Description                           |
|-------------------------|---------------------------------------|
| `GET http://localhost:4000/report`   | Shows a live HTML report of all analytics events received, split by endpoint, event type, and consent status |

### Documentation Endpoint

| Endpoint                | Description                           |
|-------------------------|---------------------------------------|
| `GET http://localhost:4000/docs`   | Interactive OpenAPI documentation for all analytics endpoints |

The `/docs` endpoint provides a Swagger UI interface for exploring all analytics endpoints exposed by the mock server. You can view request/response formats here.

---

## 🍪 Cookie Banner

The cookie banner is a modal that appears on the page when a user first visits the site and has not yet made a consent choice.

Once a choice is made, the banner disappears and the user's preference is stored in a cookie. The value of this cookie should be used to determine whether the user has given consent for analytics events to be sent.

The banner provides two options:

- **Accept**: Sets a cookie (`analytics_consent=true`) and allows analytics events to be sent.
- **Decline**: Sets a cookie (`analytics_consent=false`) and prevents analytics events from being sent.
