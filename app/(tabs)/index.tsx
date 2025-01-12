import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import { ITEMS } from "@/assets/Items";
import { ItemList } from "@/components/Items-list";
import ListHeader from "@/components/ListHeader";

const home = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={ITEMS}
        renderItem={({ item }) => <ItemList product={item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        ListHeaderComponent={ListHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        columnWrapperStyle={styles.flatListColumn}
        style={styles.flatList}
      />
    </View>
  );
};

export default home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 12,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  flatListColumn: {
    justifyContent: "space-between",
  },
  flatList: {
    paddingVertical: 5,
  },
});
