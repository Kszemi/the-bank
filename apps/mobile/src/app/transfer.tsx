import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Image } from "expo-image";
import { formatCurrencyValue } from "@the-bank/core";

import Slider from "~/components/Slider";
import { cn } from "~/lib/cn";

export default function Transactions() {
  const [title, setTitle] = useState("");
  const [transferValue, setTransferValue] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const transactionValue = Number.isNaN(transferValue)
    ? 0
    : Number(transferValue);
  const balance = 0;
  const balanceAfterTransaction = balance - transactionValue;

  const errorMessage = useMemo(() => {
    if (!selectedUser) {
      return "Pick a user for payment 💸";
    }

    if (transactionValue <= 0) {
      return "Enter the 💰 amount to send";
    }

    if (balanceAfterTransaction < 0) {
      return "Funds insufficient 🤷‍♂️";
    }

    if (title.length === 0 || title === "") {
      return "Name the transaction ✍️";
    }

    if (title.length < 3) {
      return "Details too brief ✍️";
    }

    return null;
  }, [balanceAfterTransaction, selectedUser, title, transactionValue]);

  const userResult = [
    {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      imageUrl: undefined,
      clerkId: "1",
    },
    {
      id: "2",
      firstName: "Jane",
      lastName: "Doe",
      imageUrl: undefined,
      clerkId: "2",
    },
  ];

  return (
    <View className="flex flex-1 bg-white">
      <View className="flex items-center justify-center border-b border-gray-500 p-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {userResult?.map((user) => (
            <Pressable
              key={user.id}
              className="mx-1 mt-1 flex w-24 items-center"
              onPress={() => setSelectedUser(user.clerkId)}
            >
              <View
                className={cn("rounded-full", {
                  "-m-1 border-4 border-green-900":
                    user.clerkId === selectedUser,
                })}
              >
                <Image
                  source={{ uri: user.imageUrl }}
                  style={{ borderRadius: 56, height: 56, width: 56 }}
                />
              </View>
              <Text
                className={cn("mt-2 text-center text-sm text-gray-400", {
                  "text-gray-800": user.clerkId === selectedUser,
                  "font-bold": user.clerkId === selectedUser,
                })}
                numberOfLines={2}
              >
                {user.firstName} {user.lastName}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="mb-14 flex flex-1"
        keyboardVerticalOffset={110}
      >
        <ScrollView
          scrollEnabled={false}
          contentContainerStyle={styles.scrollViewContainer}
        >
          <View className="flex w-full items-center gap-y-3">
            <View className="flex flex-row items-center">
              {transferValue !== "" ? (
                <Text className="mt-2 text-5xl">$</Text>
              ) : null}
              <TextInput
                textAlign="center"
                style={styles.input}
                value={transferValue.toString()}
                placeholder="How much?"
                keyboardType="numeric"
                placeholderTextColor="#a6a6a6"
                onChangeText={(text) => {
                  const isNumber = !Number.isNaN(Number(text));

                  if (text === "" || isNumber) {
                    setTransferValue(text);
                  }
                }}
              />
            </View>

            <View className="flex items-center">
              <Text className="text-xl">
                Current Balance:{" "}
                <Text className="font-bold">{formatCurrencyValue(0)}</Text>
              </Text>
            </View>

            <TextInput
              textAlign="center"
              style={styles.input}
              value={title}
              placeholder="For what?"
              placeholderTextColor="#a6a6a6"
              onChangeText={setTitle}
            />
          </View>
        </ScrollView>

        <Slider
          reset={false}
          sliderEnabled={!errorMessage}
          onSlideConfirm={() => {
            if (!selectedUser) {
              return Alert.alert("Select a user");
            }
          }}
        >
          {errorMessage ? (
            <Text style={[styles.textPosition]}>{errorMessage}</Text>
          ) : transactionValue ? (
            <Text style={[styles.textPosition]}>
              🚀 SLIDE TO SEND{" "}
              <Text style={styles.confirm}>{transactionValue}$</Text>
            </Text>
          ) : null}
        </Slider>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    fontSize: 48,
  },
  textPosition: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fbfbfb",
  },
  confirm: {
    color: "#16a34a",
  },
});
