import { Stack } from "expo-router";
import React from "react";


export default function ViewLayout() {

    return (
        <Stack>
            <Stack.Screen name="[beerId]" options={{headerShown: false}}/>
        </Stack>
    );

}