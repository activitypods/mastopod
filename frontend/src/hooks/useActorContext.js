import { useContext } from "react";
import ActorContext from "../contexts/ActorContext";

const useActorContext = () => {
  return useContext(ActorContext);
};

export default useActorContext;
