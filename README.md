# CollabDesk Backend

CollabDesk Backend is a robust backend system designed to power collaborative workspaces. It includes features such as video calling, file management with trash functionality, payment integration, public file sharing, and an admin dashboard for managing revenue and payment plans.

---

## Features

### 1. **Video Calling**
   - Integrated with [LiveKit](https://livekit.io/) for seamless video conferencing capabilities.
   - Enables real-time communication between users within the workspace.

### 2. **File and Folder Management**
   - **Trash System**: Files and folders moved to the trash will be permanently deleted after 7 days.
   - **Restore Functionality**: Users can restore files and folders from the trash within the 7-day period.
   - Organized structure for managing files and folders efficiently.

### 3. **Payment Integration**
   - Integrated with [Stripe](https://stripe.com/) for secure payment processing.
   - Subscription model with monthly expiration.
   - **Redis** is used to track subscription status and send notifications when subscriptions are about to expire.
   - Ensures smooth payment handling and subscription management.

### 4. **Public File Sharing**
   - Users can generate public URLs for files.
   - Public URLs allow read-only access, ensuring data integrity while enabling collaboration.

### 5. **Admin Dashboard**
   - **Revenue Filtering**: Admins can filter revenue based on various criteria (e.g., date range, payment status).
   - **Payment Plan Management**: Admins can add or modify payment plans.
   - Provides tools for monitoring and managing the platform's financial health and user subscriptions.

---

## Installation

### Prerequisites
- Node.js (v16+)
- Redis
- Stripe Account
- LiveKit Account
- Liveblocks Account
- Cloudinary Account

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/collabdesk-backend.git
   cd collabdesk-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```env
   PORT=3000
   REDIS_URL=redis://localhost:6379
   STRIPE_SECRET_KEY=your_stripe_secret_key
   LIVEKIT_API_KEY=your_livekit_api_key
   LIVEKIT_API_SECRET=your_livekit_api_secret
   ```

4. Start the server:
   ```bash
   npm start
   ```

---

## Contributing

We welcome contributions! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeatureName`).
3. Commit your changes (`git commit -m "Add some feature"`).
4. Push to the branch (`git push origin feature/YourFeatureName`).
5. Open a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

 
