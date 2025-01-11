"use client";
import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";
import { Image } from "@nextui-org/react";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title()}>Make&nbsp;</span>
        <span className={title({ color: "violet" })}>beautiful&nbsp;</span>
        <br />
        <span className={title()}>
          connections regardless of your experience.
        </span>
        <div className={subtitle({ class: "mt-4" })}>
          Built on Next UI Beautiful, fast and modern React UI library.
        </div>
      </div>

      <div className="flex gap-3">
        <Link

          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow",
          })}
          href={"/login"}
        >
          Login
        </Link>
        <Link

          className={buttonStyles({ variant: "bordered", radius: "full" })}
          href={"/register"}
        >

          <Image

            alt={"logo"}
            src={"yplexity-transparent.png"}
            width={30}
          />

          Sign Up
        </Link>
      </div>


    </section>
  );
}
