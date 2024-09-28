import IQuestion from "./Question";

export default interface IQuiz {
  _id: string;
  title: string;
  description: string;
  questions: IQuestion[];
}
