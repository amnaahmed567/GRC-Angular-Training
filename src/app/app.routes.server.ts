// Server route config for SSR.
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // /tasks/:id has a dynamic param — render on the server instead of prerendering.
  {
    path: 'tasks/:id',
    renderMode: RenderMode.Server,
  },
  // Everything else can be prerendered.
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
