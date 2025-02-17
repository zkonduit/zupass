import {
  BigIntArgument,
  DisplayOptions,
  ObjectArgument,
  PCD,
  PCDArgument,
  PCDPackage,
  SerializedPCD
} from "@pcd/pcd-types";
import JSONBig from "json-bigint";
import { EzklDisplayCardBody } from "./CardBody";

import { EzklSecretPCD, EzklSecretPCDPackage } from "@pcd/ezkl-secret-pcd";

import { v4 as uuid } from "uuid";

export const EzklDisplayPCDTypeName = "ezkl-display-pcd";

export interface EzklDisplayPCDInitArgs {
  makeEncodedVerifyLink?: (encodedPCD: string) => string;
}

export let initArgs: EzklDisplayPCDInitArgs;

export interface EzklDisplayPCDArgs {
  // hash: Uint8ClampedArray;
  secretPCD: PCDArgument<EzklSecretPCD>;
  // value empty at instqanitation
  // value populated with scerectPCD by PCDPAss
  // now we have access to args.secretPCD.value.claim.hash
}

export interface EzklDisplayPCDClaim {
  // hash: Uint8ClampedArray;
  groupName: "GROUP1";
}

// stuff i need to call prove on EzklGroupPCD
export interface EzklDisplayPCDProof {
  secretPCD: EzklSecretPCD;
}

export class EzklDisplayPCD
  implements PCD<EzklDisplayPCDClaim, EzklDisplayPCDProof>
{
  type = EzklDisplayPCDTypeName;
  claim: EzklDisplayPCDClaim;
  proof: EzklDisplayPCDProof;
  id: string;

  public constructor(
    id: string,
    claim: EzklDisplayPCDClaim,
    proof: EzklDisplayPCDProof
  ) {
    this.id = id;
    this.claim = claim;
    this.proof = proof;
  }
}

export async function prove(args: EzklDisplayPCDArgs): Promise<EzklDisplayPCD> {
  if (!args.secretPCD.value) {
    throw new Error("Cannot make group proof: missing secret pcd");
  }
  return new EzklDisplayPCD(
    uuid(),
    { groupName: "GROUP1" },
    {
      secretPCD: await EzklSecretPCDPackage.deserialize(
        args.secretPCD.value.pcd
      )
    }
  );
}

// NOTE: look at semaphore camera code
// camera calls into this verify function
export async function verify(pcd: EzklDisplayPCD): Promise<boolean> {
  // get proof from cameria as deserialized proof (hex)
  // const proof = pcd.proof.hex;

  // // call verify
  // const verified = await EzklGroupPCDPackage.verify({
  //   groupName: "GROUP1",
  //   proof: { hex: proof }
  // });

  // return verified;
  return true;
}

export async function serialize(
  pcd: EzklDisplayPCD
): Promise<SerializedPCD<EzklDisplayPCD>> {
  return {
    type: EzklDisplayPCDTypeName,
    pcd: JSONBig().stringify(pcd)
  } as SerializedPCD<EzklSecretPCD>;
}

export async function deserialize(serialized: string): Promise<EzklDisplayPCD> {
  return JSONBig().parse(serialized);
}

export function getDisplayOptions(pcd: EzklDisplayPCD): DisplayOptions {
  return {
    header: "Ezkl Display PCD",
    // displayName: "ezkl-secret-" + pcd.id.substring(0, 4)
    displayName: "ezkl-display-" + pcd.id.substring(0, 4)
  };
}

export const EzklDisplayPCDPackage: PCDPackage = {
  name: EzklDisplayPCDTypeName,
  renderCardBody: EzklDisplayCardBody,
  getDisplayOptions,
  prove,
  verify,
  serialize,
  deserialize
};
