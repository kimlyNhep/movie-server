import { Stream } from "stream";
import { Field, InputType } from "type-graphql";

@InputType()
export class Upload {
  @Field()
  filename: string;

  @Field()
  mimeType: string;

  @Field()
  encoding: string;
  createReadStream: () => Stream;
}
