/*
 * SonarQube
 * Copyright (C) 2009-2022 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
package org.sonar.core.sarif;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import org.apache.commons.io.IOUtils;
import org.junit.Test;
import org.sonar.core.sarif.Sarif210;
import org.sonar.test.JsonAssert;

import static java.util.Objects.requireNonNull;

public class Sarif210SerializationDeserializationTest {

  private static final String VALID_SARIF_210_FILE_JSON = "valid-sarif210.json";

  @Test
  public void verify_json_serialization_of_sarif210() throws IOException {
    Gson gson = new GsonBuilder().setPrettyPrinting().create();

    String expectedJson = IOUtils.toString(requireNonNull(getClass().getResource(VALID_SARIF_210_FILE_JSON)), StandardCharsets.UTF_8);
    Sarif210 deserializedJson = gson.fromJson(expectedJson, Sarif210.class);
    String reserializedJson = gson.toJson(deserializedJson);

    JsonAssert.assertJson(reserializedJson).isSimilarTo(expectedJson);
  }

}
