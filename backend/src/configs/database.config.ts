import { connect } from "mongoose";

export const dbConnect = () => {
  connect(process.env.MONGO_URI!).then(() => {
    console.log("connected to DB"),
      (error: any) => {
        console.log(error);
      };
  });
};
