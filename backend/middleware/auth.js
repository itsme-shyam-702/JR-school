import { clerkClient } from "@clerk/clerk-sdk-node";

// ✅ Verify session token
export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const session = await clerkClient.sessions.verifySession(token);
    if (!session?.userId) return res.status(401).json({ message: "Unauthorized" });

    req.userId = session.userId;
    next();
  } catch (err) {
    console.error("Auth failed:", err);
    res.status(401).json({ message: "Unauthorized" });
  }
};

// ✅ Check user role
export const requireRole = (roles) => {
  return async (req, res, next) => {
    try {
      const user = await clerkClient.users.getUser(req.userId);
      const userRole = user?.privateMetadata?.role || "visitor";
      if (!roles.includes(userRole)) {
        return res.status(403).json({ message: "Forbidden" });
      }
      next();
    } catch (err) {
      console.error("Role check failed:", err);
      res.status(403).json({ message: "Forbidden" });
    }
  };
};
