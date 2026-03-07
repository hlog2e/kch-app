import React, { useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Platform,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Picker } from "@react-native-picker/picker";

// ---------- Types ----------

export interface DropdownItem<T = string | number> {
  label: string;
  value: T;
}

export interface DropdownProps<T = string | number> {
  items: DropdownItem<T>[];
  value: T | null;
  onValueChange: (value: T) => void;
  placeholder?: string;
  onOpen?: () => void;
  onClose?: () => void;
  renderTrigger?: (props: {
    label: string;
    isOpen: boolean;
    onPress: () => void;
  }) => React.ReactNode;
  modalTitle?: string;
  disabled?: boolean;
}

// ---------- DefaultTrigger ----------

function DefaultTrigger({
  label,
  isPlaceholder,
  onPress,
}: {
  label: string;
  isPlaceholder: boolean;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[triggerStyles.trigger, { borderColor: colors.border }]}
    >
      <Text
        style={[
          triggerStyles.text,
          { color: isPlaceholder ? colors.subText : colors.text },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
      <Ionicons name="chevron-down" size={16} color={colors.subText} />
    </Pressable>
  );
}

const triggerStyles = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },
});

// ---------- DropdownAndroid ----------

function DropdownAndroid<T = string | number>({
  items,
  value,
  onValueChange,
  placeholder = "선택해주세요",
  onOpen,
  onClose,
  renderTrigger,
  modalTitle,
  disabled = false,
}: DropdownProps<T>) {
  const { colors } = useTheme();
  const pickerRef = useRef<Picker<T>>(null);
  const [isOpen, setIsOpen] = useState(false);

  const selectedItem = items.find((i) => i.value === value);
  const displayLabel = selectedItem ? selectedItem.label : placeholder;

  const handleOpen = useCallback(() => {
    if (disabled) return;
    if (renderTrigger) {
      (pickerRef.current as any)?.focus?.();
    }
  }, [disabled, renderTrigger]);

  return (
    <View>
      {renderTrigger ? (
        renderTrigger({
          label: displayLabel,
          isOpen,
          onPress: handleOpen,
        })
      ) : (
        <DefaultTrigger
          label={displayLabel}
          isPlaceholder={!selectedItem}
          onPress={() => {}}
        />
      )}
      <Picker
        ref={pickerRef}
        selectedValue={value ?? ("" as any)}
        onValueChange={(v) => {
          if (v === "" || v === null) return;
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onValueChange(v as T);
        }}
        onFocus={() => {
          setIsOpen(true);
          onOpen?.();
        }}
        onBlur={() => {
          setIsOpen(false);
          onClose?.();
        }}
        mode="dialog"
        prompt={modalTitle}
        enabled={!disabled}
        style={[
          StyleSheet.absoluteFill,
          { opacity: 0 },
          renderTrigger ? { position: "absolute" } : undefined,
        ]}
        dropdownIconColor="transparent"
      >
        {value === null && (
          <Picker.Item
            label={placeholder}
            value={"" as any}
            enabled={false}
          />
        )}
        {items.map((item) => (
          <Picker.Item
            key={String(item.value)}
            label={item.label}
            value={item.value}
          />
        ))}
      </Picker>
    </View>
  );
}

// ---------- DropdownIOS ----------

function DropdownIOS<T = string | number>({
  items,
  value,
  onValueChange,
  placeholder = "선택해주세요",
  onOpen,
  onClose,
  renderTrigger,
  modalTitle,
  disabled = false,
}: DropdownProps<T>) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const [tempValue, setTempValue] = useState<T | null>(value);

  const selectedItem = items.find((i) => i.value === value);
  const displayLabel = selectedItem ? selectedItem.label : placeholder;

  const handleOpen = useCallback(() => {
    if (disabled) return;
    setTempValue(value ?? items[0]?.value ?? null);
    setOpen(true);
    onOpen?.();
  }, [disabled, value, items, onOpen]);

  const handleDone = useCallback(() => {
    if (tempValue !== null) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onValueChange(tempValue as T);
    }
    setOpen(false);
    onClose?.();
  }, [tempValue, onValueChange, onClose]);

  const handleCancel = useCallback(() => {
    setOpen(false);
    onClose?.();
  }, [onClose]);

  return (
    <>
      {renderTrigger ? (
        renderTrigger({
          label: displayLabel,
          isOpen: open,
          onPress: handleOpen,
        })
      ) : (
        <DefaultTrigger
          label={displayLabel}
          isPlaceholder={!selectedItem}
          onPress={handleOpen}
        />
      )}

      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <Pressable style={iosStyles.backdrop} onPress={handleCancel} />
        <View
          style={[
            iosStyles.sheet,
            {
              backgroundColor: colors.cardBg,
              paddingBottom: insets.bottom,
            },
          ]}
        >
          <View
            style={[iosStyles.toolbar, { borderBottomColor: colors.border }]}
          >
            {modalTitle ? (
              <Text style={[iosStyles.title, { color: colors.text }]}>
                {modalTitle}
              </Text>
            ) : (
              <View />
            )}
            <Pressable onPress={handleDone} hitSlop={8}>
              <Text style={[iosStyles.doneText, { color: colors.blue }]}>
                완료
              </Text>
            </Pressable>
          </View>
          <Picker
            selectedValue={tempValue ?? ("" as any)}
            onValueChange={(v) => {
              if (v === "" || v === null) return;
              setTempValue(v as T);
            }}
            itemStyle={{ color: colors.text }}
          >
            {value === null && tempValue === null && (
              <Picker.Item
                label={placeholder}
                value={"" as any}
                enabled={false}
              />
            )}
            {items.map((item) => (
              <Picker.Item
                key={String(item.value)}
                label={item.label}
                value={item.value}
              />
            ))}
          </Picker>
        </View>
      </Modal>
    </>
  );
}

const iosStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },
  sheet: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
  },
  doneText: {
    fontSize: 17,
    fontWeight: "600",
  },
});

// ---------- Dropdown (main) ----------

export default function Dropdown<T = string | number>(
  props: DropdownProps<T>,
) {
  if (Platform.OS === "android") {
    return <DropdownAndroid {...props} />;
  }
  return <DropdownIOS {...props} />;
}
