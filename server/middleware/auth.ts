import { getServerSession } from "#auth";

export default eventHandler(async (event) => {
  const session = await getServerSession(event);
  if (!session && !event.node.req.url?.startsWith("/api/auth/")) {
    throw { statusMessage: "Unauthenticated", statusCode: 403 };
  } else {
    event.context.session = session;
  }
});
