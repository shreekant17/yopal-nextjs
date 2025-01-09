"use client";

import { useAuth } from "@/store/auth";

import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
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
  const { logout } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [fname, setFname] = useState<string>("");
  const [avatar, setAvatar] = useState<string>();
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  useEffect(() => {
    if (session) {

      const { fname, avatar } = session?.user as SessionUser;
      setFname(fname || "")
      setAvatar(avatar || undefined);
      console.log(avatar)
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
    <NextUINavbar maxWidth="xl" position="sticky" isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
      <UploadPost isOpen={isOpen} onClose={onClose} />
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/" onClick={() => setIsMenuOpen(false)}>
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

              <NavbarContent as="div" justify="end" className="hidden lg:flex">

                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <Button

                      className="text-sm font-normal text-default-600 bg-default-100"

                      startContent={<Image radius="full" className="object-cover w-8 h-8 opacity-100" src={avatar} />}
                      variant="flat"
                    >
                      {fname}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Profile Actions" variant="flat">
                    <DropdownItem key="profile" className="h-14 gap-2">
                      <p className="font-semibold">Signed in as</p>
                      <p className="font-semibold">zoey@example.com</p>
                    </DropdownItem>
                    <DropdownItem key="settings" as={Link} href={"/account"}>My Account</DropdownItem>
                    <DropdownItem key="team_settings">Team Settings</DropdownItem>
                    <DropdownItem key="analytics">Analytics</DropdownItem>
                    <DropdownItem key="system">System</DropdownItem>
                    <DropdownItem key="configurations">Configurations</DropdownItem>
                    <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
                    <DropdownItem key="logout" color="danger"

                      onPress={logout}
                    >
                      Log Out
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </NavbarContent>

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
          status === "authenticated" && (
            <Button isIconOnly aria-label="Share" color="danger" onPress={onOpen}>
              <PlusIcon />
            </Button>
          )
        }

        {
          status === "authenticated" ? (
            <Button
              isIconOnly
              radius="full"
              color="danger"
              className="text-sm font-normal text-default-600 bg-default-100"
              onPress={() => setIsMenuOpen(!isMenuOpen)}
              startContent={<Image radius="full" className="object-cover w-8 h-8 opacity-100" src={avatar} />}
              variant="flat"
            >

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







      </NavbarContent>

      <NavbarMenu>
        {searchInput}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          <NavbarMenuItem>
            <Link
              size="lg"
              href="/account"
              color={
                "foreground"
              }
              onPress={() => setIsMenuOpen(false)}

            >
              Account
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link

              size="lg"
              href="/feed"
              color={
                "foreground"
              }
              onPress={() => setIsMenuOpen(false)}
            >
              Feed
            </Link>
          </NavbarMenuItem>
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  "foreground"
                }
                href="#"
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
          <NavbarMenuItem>
            <Link
              color="danger"
              size="lg"
              href="#"
              onPress={() => {
                logout();
                setIsMenuOpen(false);
              }}
            >
              Logout
            </Link>

          </NavbarMenuItem>
        </div>
      </NavbarMenu>

    </NextUINavbar>
  );
};
