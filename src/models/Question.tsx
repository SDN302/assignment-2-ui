export default interface IQuestion{
    _id: string;
    text: string;
    options: string[];
    keywords: string[];
    correctAnswerIndex: number;
}