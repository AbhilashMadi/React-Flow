import { useAppDispatch, useAppSelector } from "@/hooks/state-hooks";
import { FC } from "react";
import { decrement, increment, incrementByVal } from "@/store/reducers/counter-slice";

const HeroPage: FC = () => {
  const { value } = useAppSelector(state => state.counter);
  const dispatch = useAppDispatch();

  return (
    <div>
      {value}
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
      <button onClick={() => dispatch(incrementByVal(2))}>+2</button>
    </div>
  )
}

export default HeroPage;