import { Slot, Stack } from "expo-router";
import React from "react";
import { SearchBar } from "@rneui/themed";
import { useState } from "react";
import { palette } from "../../assets/palette";
import Search from "../../components/Search";
import { StyleSheet } from "react-native";

function _layout() {
  const [search, setSearch] = useState<string>("");
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

  const updateSearch = (search: string) => {
    setSearch(search);
  };

  return (
    <>
      <SearchBar
        cancelButtonProps={{}}
        cancelButtonTitle="Cancel"
        onCancel={() => setIsSearchFocused(false)}
        placeholder="Type Here..."
        onChangeText={updateSearch}
        value={search}
        containerStyle={{ backgroundColor: palette.components }}
        inputContainerStyle={{ backgroundColor: palette.components }}
        onPress={() => {
          setIsSearchFocused(true);
        }}
        showCancel={true}
        onClear={() => {
          setSearch("");
          setIsSearchFocused(false);
        }}
      />
      {isSearchFocused && <Search searchQuery={search} />}
      {!isSearchFocused && <Slot />}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: palette.components,
  },
  button: {
    backgroundColor: palette.components,
  },
});

export default _layout;
