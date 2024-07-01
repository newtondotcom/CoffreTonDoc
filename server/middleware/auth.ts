import { getServerSession } from "#auth";

export default eventHandler(async (event) => {
  // Protect all API endpoints inside protected
  if (!event.node.req.url?.startsWith("/api/protected")) {
    return;
  }

  const session = await getServerSession(event);
  console.log(session);
  event.context.session = session;
  if (!session) {
    throw { statusMessage: "Unauthenticated", statusCode: 403 };
  }
});
