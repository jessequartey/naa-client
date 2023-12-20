import React from "react";

import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import MobileNav from "./MobileNav";
import UserAccountNav from "./UserAccountNav";
import { buttonVariants } from "./ui/button";
import { ArrowRight } from "lucide-react";

export default function Navbar() {
  const user = null;
  return (
    <nav className="sticky inset-x-0 top-0 z-30 h-14 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="z-40 flex font-semibold">
            <span>Naa AI</span>
          </Link>
          <MobileNav isAuth={!!user} />

          <div className="hidden items-center space-x-4 sm:flex">
            {!user ? (
              <>
                <Link
                  href="#pricing"
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  })}
                >
                  Pricing
                </Link>
                <Link
                  href="/signin"
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  })}
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className={buttonVariants({
                    size: "sm",
                  })}
                >
                  Get started <ArrowRight className="ml-1.5 h-5 w-5" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  })}
                >
                  Dashboard
                </Link>

                <UserAccountNav
                  name={!user.name ? "Your Account" : `${user.name}`}
                  email={user.email ?? ""}
                  imageUrl={user.image ?? ""}
                />
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
}
