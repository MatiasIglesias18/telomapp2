import { Picker } from "@react-native-picker/picker";
import { barriosCABA } from "../../../utils/barriosCABA";
export const SelectorBarrio = ({ selectedBarrio, setSelectedBarrio }) => {
  return (
    <Picker
      selectedValue={selectedBarrio}
      defaultValue={""}
      onValueChange={(itemValue, itemIndex) => setSelectedBarrio(`${itemValue}`)}
      mode="dropdown"
    >
      {barriosCABA.map((barrio, index) => {
        return <Picker.Item key={barrio.id} label={barrio.barrio} value={`${barrio.id}`} />;
      })}
    </Picker>
  );
};
