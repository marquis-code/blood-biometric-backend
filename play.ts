

// ### Users Controller (src/users/users.controller.ts)
// ```typescript

// ```

// ## 11. Modules

// ### Auth Module (src/auth/auth.module.ts)
// ```typescript

// ```

// ### Users Module (src/users/users.module.ts)
// ```typescript

// ```

// ### Blogs Module (src/blogs/blogs.module.ts)
// ```typescript

// ```

// ### Comments Module (src/comments/comments.module.ts)
// ```typescript

// ```

// ## 12. App Module (src/app.module.ts)
// ```typescript

// ```

// ## 13. Main.ts (src/main.ts)
// ```typescript

// ```

// ## 14. Environment Variables (.env)
// ```env
// # Database

// ```

// ## 15. Get User Decorator (src/common/decorators/get-user.decorator.ts)
// ```typescript

// ```

// ## API Endpoints Summary

// ### Auth Routes
// - POST `/api/auth/register` - Register new user
// - POST `/api/auth/login` - Login user
// - GET `/api/auth/profile` - Get current user profile

// ### Blog Routes
// - GET `/api/blogs` - Get all published blogs (with pagination, search, filters)
// - GET `/api/blogs/trending` - Get trending blogs
// - GET `/api/blogs/featured` - Get featured/pinned blogs
// - GET `/api/blogs/slug/:slug` - Get blog by slug
// - GET `/api/blogs/:id` - Get blog by ID
// - GET `/api/blogs/author/:authorId` - Get blogs by author
// - POST `/api/blogs` - Create new blog (auth required)
// - PATCH `/api/blogs/:id` - Update blog (auth required, owner/admin only)
// - DELETE `/api/blogs/:id` - Delete blog (auth required, owner/admin only)
// - POST `/api/blogs/:id/like` - Like blog (auth required)
// - DELETE `/api/blogs/:id/like` - Unlike blog (auth required)

// ### Comment Routes
// - GET `/api/comments/blog/:blogId` - Get comments for a blog
// - GET `/api/comments/:id` - Get comment by ID
// - GET `/api/comments/:id/replies` - Get replies to a comment
// - POST `/api/comments` - Create comment (auth required)
// - PATCH `/api/comments/:id` - Update comment (auth required, owner/admin only)
// - DELETE `/api/comments/:id` - Delete comment (auth required, owner/admin only)
// - POST `/api/comments/:id/like` - Like comment (auth required)
// - DELETE `/api/comments/:id/like` - Unlike comment (auth required)

// ### User Routes
// - GET `/api/users` - Get all users (admin only)
// - GET `/api/users/:id` - Get user by ID
// - POST `/api/users/:id/follow` - Follow user (auth required)
// - DELETE `/api/users/:id/follow` - Unfollow user (auth required)
// - DELETE `/api/users/:id` - Deactivate user (admin only)

// ### Admin Routes
// - GET `/api/blogs/admin/all` - Get all blogs including drafts (admin only)
// - PATCH `/api/blogs/admin/:id/pin` - Pin blog (admin only)
// - PATCH `/api/blogs/admin/:id/unpin` - Unpin blog (admin only)

// ## Installation & Setup

// 1. Install dependencies: `npm install`
// 2. Set up environment variables in `.env` file
// 3. Start MongoDB
// 4. Run the application: `npm run start:dev`

// ## Key Features Implemented

// ✅ **User Management**: Registration, login, profiles, follow system
// ✅ **Blog CRUD**: Create, read, update, delete with rich features
// ✅ **Comments System**: Nested comments with likes
// ✅ **Authentication**: JWT-based with role-based access
// ✅ **Authorization**: User/Admin roles with proper guards
// ✅ **Search & Filtering**: Full-text search, category, tag filters
// ✅ **Pagination**: Efficient pagination for all list endpoints
// ✅ **Performance**: Database indexes, optimized queries
// ✅ **Validation**: Input validation with class-validator
// ✅ **Security**: Rate limiting, CORS, input sanitization
// ✅ **Scalability**: Modular architecture, proper separation of concerns

// This is a production-ready blog backend that can handle real-world traffic and requirements!