"use client";


import { Avatar } from "@nextui-org/react";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from 'next/navigation';
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { Kbd } from "@nextui-org/kbd";
import { Link } from "@nextui-org/link";
import { Input } from "@nextui-org/input";
import { button, link as linkStyles } from "@nextui-org/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { useDisclosure } from '@nextui-org/react';
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  TwitterIcon,
  GithubIcon,
  DiscordIcon,
  HeartFilledIcon,
  SearchIcon,
  Logo,
} from "@/components/icons";
import UploadPost from "./UploadPost";
import { PlusIcon } from "./PlusIcon";
import { Image } from "@nextui-org/react";
import { UserIcon } from "./UserIcon";
import { ExitIcon } from "./ExitIcon";
import { LoginIcon } from "./LoginIcon";
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react";
import { Router } from "next/router";
import { SessionUser } from "@/types";
import { UserSession } from "@/types";
import React from "react";


export const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [fname, setFname] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("/icon.png");
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session) {

      const { fname, avatar } = session?.user as SessionUser;
      setFname(fname || "")
    }

  }, [session]);


  const router = useRouter();

  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={["command"]}>
          K
        </Kbd>
      }
      labelPlacement="outside"
      placeholder="Search..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <UploadPost isOpen={isOpen} onClose={onClose} />
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Image

              alt={"logo"}
              src={"icon.png"}
              width={30}
            />
            <p className="font-bold text-inherit">Yo!Pal</p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <Button isIconOnly onPress={onOpen}>
            <PlusIcon />
          </Button>
          <ThemeSwitch />

        </NavbarItem>
        <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>
        <NavbarItem className="hidden md:flex">
          {
            status === "authenticated" ? (
              <Button
                as={Link}
                className="text-sm font-normal text-default-600 bg-default-100"
                href={"/account"}
                startContent={<Avatar size="md" src={avatar} />}
                variant="flat"
              >
                {fname}
              </Button>

            ) : (
              <Button

                as={Link}
                className="text-sm font-normal text-default-600 bg-default-100"
                href={"/login"}
                startContent={<UserIcon />}
                variant="flat"
              >
                Sign In
              </Button>
            )
          }

        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">

        <ThemeSwitch />

        {
          status === "authenticated" ? (
            <Button
              isIconOnly
              onPress={async () => {
                try {
                  const response = await fetch("/api/logout", {
                    method: "GET",
                  });

                  if (!response.ok) {
                    return;
                  }
                  await signOut({ redirect: false });
                } catch (error) {
                  console.error('Error during sign-out or fetching user data:', error);
                }
              }}
            >
              <ExitIcon />
            </Button>
          ) : (
            <Button
              isIconOnly
              onPress={() => {
                router.push("/login");
              }}

            >
              <UserIcon />

            </Button>
          )
        }

        {
          status === "authenticated" && (
            <Button isIconOnly aria-label="Share" color="danger" onPress={onOpen}>
              <PlusIcon />
            </Button>
          )
        }



        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        {searchInput}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href="#"
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
