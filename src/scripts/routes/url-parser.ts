export interface PathSegments {
  resource: string | null;
  id: string | null;
}
function extractPathnameSegments(path: string): PathSegments {
  const splitUrl = path.split("/");

  return {
    resource: splitUrl[1] || null,
    id: splitUrl[2] || null,
  };
}

function constructRouteFromSegments(pathSegments: PathSegments): string {
  let pathname = "";

  if (pathSegments.resource) {
    pathname = pathname.concat(`/${pathSegments.resource}`);
  }

  if (pathSegments.id) {
    pathname = pathname.concat("/:id");
  }

  return pathname || "/";
}

// path aktif (tanpa hash #)
export function getActivePathname(): string {
  return window.location.hash.replace("#", "") || "/";
}

// route aktif dalam format /resource/:id
export function getActiveRoute(): string {
  const pathname = getActivePathname();
  const urlSegments = extractPathnameSegments(pathname);
  return constructRouteFromSegments(urlSegments);
}

// segment aktif
export function parseActivePathname(): PathSegments {
  const pathname = getActivePathname();
  return extractPathnameSegments(pathname);
}

// route dari pathname tertentu
export function getRoute(pathname: string): string {
  const urlSegments = extractPathnameSegments(pathname);
  return constructRouteFromSegments(urlSegments);
}

// segment dari pathname tertentu
export function parsePathname(pathname: string): PathSegments {
  return extractPathnameSegments(pathname);
}
