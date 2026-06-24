import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import site from "../content/site.json";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/layout/BackToTop";
import { Crest } from "@/components/heraldry/Crest";
import { Splash } from "@/components/splash/Splash";

function NotFoundComponent() {
  return (
    <div className="min-h-screen grid place-items-center bg-paper-grain px-4 text-center">
      <div className="max-w-md">
        <Crest size={120} />
        <p className="eyebrow mt-6">By Royal Apology</p>
        <h1 className="font-display text-6xl mt-3 text-emerald-ink">404</h1>
        <p className="mt-4 font-display italic text-charcoal/70">
          This page has wandered from the procession.
        </p>
        <Link to="/" className="btn-royal mt-8 inline-flex">Return home</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="min-h-screen grid place-items-center bg-paper-grain px-4 text-center">
      <div className="max-w-md">
        <Crest size={120} />
        <p className="eyebrow mt-6">A small disturbance</p>
        <h1 className="font-display text-3xl mt-3 text-emerald-ink">
          This page didn’t load
        </h1>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="btn-royal"
          >
            Try again
          </button>
          <a href="/" className="btn-royal-ghost">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${site.bride.first} & ${site.groom.first} — ${site.date.display}` },
      { name: "description", content: `${site.appointment} — the wedding of ${site.bride.first} & ${site.groom.first}. ${site.tagline}.` },
      { name: "theme-color", content: "#0b3b2e" },
      { property: "og:title", content: `${site.bride.first} & ${site.groom.first} — ${site.date.display}` },
      { property: "og:description", content: `${site.appointment} — the wedding of ${site.bride.first} & ${site.groom.first}. ${site.tagline}.` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: `${site.bride.first} & ${site.groom.first} — ${site.date.display}` },
      { name: "twitter:description", content: `${site.appointment} — the wedding of ${site.bride.first} & ${site.groom.first}. ${site.tagline}.` },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e3d1048f-1e2b-42e6-87ba-043a6d9a2cc8/id-preview-8c9d01d2--0c9ac2a0-f7ce-4858-a793-0605c60d7cd3.lovable.app-1782221928616.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e3d1048f-1e2b-42e6-87ba-043a6d9a2cc8/id-preview-8c9d01d2--0c9ac2a0-f7ce-4858-a793-0605c60d7cd3.lovable.app-1782221928616.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/cipher-favicon.svg", type: "image/svg+xml" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Smooth scroll to top on route change
  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <Splash />
      <Header />
      <main className="min-h-screen pt-[72px]">
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
    </QueryClientProvider>
  );
}
