import {
  Link as TanStackLink,
  Outlet,
  useNavigate as useTanStackNavigate,
  useRouterState,
  useParams as useTanStackParams,
} from "@tanstack/react-router";

import type {
  ComponentProps,
  ReactNode,
} from "react";

export { Outlet };

type BaseLinkProps = Omit<
  ComponentProps<typeof TanStackLink>,
  "to" | "className"
>;

type LinkProps = BaseLinkProps & {
  to: string;
  className?: string;
  children?: ReactNode;
};

export function Link({
  to,
  ...props
}: LinkProps) {
  return <TanStackLink to={to} {...props} />;
}

type NavLinkProps = BaseLinkProps & {
  to: string;
  end?: boolean;
  className?:
    | string
    | ((props: { isActive: boolean }) => string);
  children?: ReactNode;
};

export function NavLink({
  to,
  end,
  className,
  ...props
}: NavLinkProps) {
  const pathname = useRouterState({
    select: state => state.location.pathname,
  });

  const isActive = end
    ? pathname === to
    : to === "/"
      ? pathname === "/"
      : pathname === to ||
        pathname.startsWith(`${to}/`);

  const resolvedClassName =
    typeof className === "function"
      ? className({ isActive })
      : className;

  return (
    <TanStackLink
      to={to}
      {...props}
      className={resolvedClassName}
    />
  );
}

export function useNavigate() {
  const navigate = useTanStackNavigate();

  return (
    to: string | number,
    options?: {
      replace?: boolean;
      state?: unknown;
    }
  ) => {
    if (typeof to === "number") {
      window.history.go(to);
      return;
    }

    const url = new URL(to, window.location.origin);

    void navigate({
      to: url.pathname,
      search: Object.fromEntries(url.searchParams),
      hash: url.hash || undefined,
      replace: options?.replace,
    });
  };
}

export function useLocation() {
  const location = useRouterState({
    select: state => state.location,
  });

  return {
    pathname: location.pathname,
    search: location.searchStr,
    hash: location.hash,
    state: location.state,
  };
}

export function useSearchParams() {
  const { search } = useLocation();

  return [
    new URLSearchParams(search),
    () => {},
  ] as const;
}

export function useParams() {
  return useTanStackParams({
    strict: false,
  });
}