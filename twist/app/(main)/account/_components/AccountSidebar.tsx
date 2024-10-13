"use client";

import { signOutFunction } from "@/actions/logout";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import React from "react";

export default function AccountSidebar() {
    return (
        <div className="h-full w-1/5 flex flex-col border-r border-border">
            <div className="pt-24 flex flex-col flex-1 gap-1 px-4 pb-5">
                <Button className="justify-start">
                    <Icons.Profile className="w-4 h-4 mr-2" />
                    Twoje dane
                </Button>
                <Button className="justify-start" variant="ghost">
                    <Icons.Safe className="w-4 h-4 mr-2" />
                    Bezpieczeństwo
                </Button>
                <Button className="justify-start" variant="ghost">
                    <Icons.Stats className="w-4 h-4 mr-2" />
                    Statystyki
                </Button>
                <Button className="justify-start" variant="ghost">
                    <Icons.Settings2 className="w-4 h-4 mr-2" />
                    Ustawienia
                </Button>
                <div className="grow"></div>
                <Button
                    className="justify-start"
                    variant="ghost"
                    onClick={() => signOutFunction()}
                >
                    <Icons.LogOut className="w-4 h-4 mr-2" />
                    Wyloguj
                </Button>
            </div>
        </div>
    );
}
