export type HttpVerbs = "get" | "delete" | "get" | "head" | "options" | "patch" | "post" | "put"; // | "trans";
export type RestifyHttpVerbs = Omit<HttpVerbs, "delete" | "options"> | "del" | "opts";

export enum HttpVerbsEnum {
  //   GET
  // The GET method requests a representation of the specified resource.Requests using GET should only retrieve data.

  get = "GET",

  //   HEAD
  // The HEAD method asks for a response identical to that of a GET request, but without the response body.
  head = "HEAD",

  //   POST
  // The POST method is used to submit an entity to the specified resource, often causing a change in state or side effects on the server.
  post = "POST",

  //   PUT
  // The PUT method replaces all current representations of the target resource with the request payload.
  put = "PUT",

  //   DELETE
  // The DELETE method deletes the specified resource.
  delete = "DELETE",

  //   CONNECT
  // The CONNECT method establishes a tunnel to the server identified by the target resource.

  connect = "CONNECT",
  //   OPTIONS
  // The OPTIONS method is used to describe the communication options for the target resource.
  options = "OPTOINS",
  //   TRACE
  // The TRACE method performs a message loop-back test along the path to the target resource.
  trans = "TRACE",
  //   PATCH
  // The PATCH method is used to apply partial modifications to a resource.
  patch = "PATCH"
}