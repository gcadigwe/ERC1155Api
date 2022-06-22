import { BigInt, ipfs, json } from "@graphprotocol/graph-ts";
import { TransferBatch, TransferSingle } from "../generated/Token/Token";
import { User, Token } from "../generated/schema";

const ipfsHash = "bafybeigduncdckmak2zljhdifpvimzdhgkdunyjcssyao2ay23rsgbbixi";

export function handleTransferBatch(event: TransferBatch): void {
  let batchLength = event.params.ids.length;

  for (let i = 0; i < batchLength; i++) {
    let token = Token.load(event.params.ids[i].toString());
    if (!token) {
      token = new Token(event.params.ids[i].toString());
      token.tokenID = event.params.ids[i];
      token.tokenURI =
        "/" + "RigelJson/" + event.params.ids[i].toString() + ".json";
      let metadata = ipfs.cat(ipfsHash + token.tokenURI);

      if (metadata) {
        const value = json.fromBytes(metadata).toObject();

        if (value) {
          const image = value.get("image");
          const name = value.get("name");
          const description = value.get("description");
          if (name && image && description) {
            token.image = image.toString();
            token.name = name.toString();
            token.description = description.toString();
          }
        }
      }
    }
    token.updatedAtTimeStamp = event.block.timestamp;
    token.owner = event.params.to.toHexString();
    token.save();

    let user = User.load(event.params.to.toHexString());
    if (!user) {
      user = new User(event.params.to.toHexString());
      user.save();
    }
  }
}

export function handleTransferSingle(event: TransferSingle): void {
  let token = Token.load(event.params.id.toString());
  if (!token) {
    token = new Token(event.params.id.toString());
    token.tokenID = event.params.id;
    token.tokenURI = "/" + "RigelJson/" + event.params.id.toString() + ".json";
    let metadata = ipfs.cat(ipfsHash + token.tokenURI);

    if (metadata) {
      const value = json.fromBytes(metadata).toObject();

      if (value) {
        const image = value.get("image");
        const name = value.get("name");
        const description = value.get("description");
        if (name && image && description) {
          token.image = image.toString();
          token.name = name.toString();
          token.description = description.toString();
        }
      }
    }
  }
  token.updatedAtTimeStamp = event.block.timestamp;
  token.owner = event.params.to.toHexString();
  token.save();

  let user = User.load(event.params.to.toHexString());
  if (!user) {
    user = new User(event.params.to.toHexString());
    user.save();
  }
}

// tokenID: BigInt!
//   tokenURI: String!
//   image: String!
//   name: String!
//   description: String!
//   updatedAtTimeStamp: BigInt!
//   owner: User!
