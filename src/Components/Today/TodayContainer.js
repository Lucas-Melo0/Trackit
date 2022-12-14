import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import styled from "styled-components";
import { getTodayHabits } from "../../API/sendData";
import { UserContext } from "../UserContext";
import TodayHabit from "./TodayHabit";
import { useEffect, useState, useContext } from "react";
import { checkHabitAsDone, unCheckHabitAsDone } from "../../API/sendData";
import Loader from "../Loader/Loader";

export default function TodayContainer() {
  const [habitInfo, setHabitInfo] = useState([]);
  const { userInfo, percentage, setPercentage } = useContext(UserContext);
  const weekday = dayjs().locale("pt-br").format("dddd");
  const month = dayjs().format("MM");
  const day = dayjs().format("DD");
  const [render, setRender] = useState(true);

  useEffect(() => {
    getTodayHabits(userInfo.token)
      .catch((value) => console.log(value))
      .then((value) => {
        setHabitInfo(value.data);
      });
  }, [render]);

  const done = habitInfo.filter((value) => value.done === true).length;
  const total = habitInfo.length;
  const finalPercentage = Math.round((done / total) * 100);
  setPercentage(finalPercentage);

  function toggleHabit(value) {
    if (value.done === true) {
      unCheckHabitAsDone(value.id, userInfo.token).then((response) => {
        setRender(!render);
      });
    } else {
      checkHabitAsDone(value.id, userInfo.token).then(() => setRender(!render));
    }
  }

  return (
    <Wrapper>
      <Container>
        <H3>
          {weekday}, {day}/{month}
        </H3>

        {done === 0 ? (
          <H5>Nenhum hábito concluído ainda</H5>
        ) : (
          <H6>{percentage} % dos hábitos concluídos</H6>
        )}
        {habitInfo.map((value, index) => {
          return (
            <TodayHabit key={index} toggleHabit={toggleHabit} value={value} />
          );
        })}
      </Container>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100vw;
  min-height: 90vh;
  background-color: #f2f2f2;
`;

const Container = styled.div`
  row-gap: 10px;
  display: flex;
  flex-direction: column;
  width: 90vw;
  margin: 0 auto;
  padding: 20px 0;
  margin-top: 70px;
`;
const H3 = styled.h3`
  font-family: "Lexend Deca", sans-serif;
  font-size: 23px;
  color: #126ba5;
`;
const H5 = styled.h5`
  color: #bababa;
  font-family: "Lexend Deca", sans-serif;
  font-size: 18px;
`;
const H6 = styled.h6`
  color: #8fc549;
  font-family: "Lexend Deca", sans-serif;
  font-size: 18px;
`;
